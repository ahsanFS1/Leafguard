from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from tensorflow.keras.preprocessing import image
import numpy as np
from tensorflow.keras.models import load_model
from io import BytesIO
import os
from groq import Groq
from dotenv import load_dotenv

from training.config import LABELS_PATH, MODEL_PATH

# Load environment variables
load_dotenv()

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://172.28.4.58:3000"  # Network address from your dev server
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the trained model
model = load_model(MODEL_PATH)

# Initialize Groq client
groq_client = Groq(api_key=os.environ.get("GROQ_API_KEY"))


def generate_remedy(disease_name: str) -> str:
    """
    Generate a comprehensive treatment remedy for the detected plant disease using Groq AI.
    
    Args:
        disease_name: The name of the detected plant disease
        
    Returns:
        A detailed remedy with treatment options and prevention tips
    """
    prompt = f"""You are an expert plant pathologist and agricultural advisor. A plant disease has been detected: "{disease_name}".

Please provide a comprehensive, practical treatment plan in the following format:

**Disease Overview:**
- Brief description of the disease and its impact

**Immediate Treatment:**
- Step-by-step treatment instructions
- Recommended fungicides, pesticides, or organic treatments
- Application methods and frequency

**Cultural Practices:**
- Pruning and sanitation recommendations
- Watering and fertilization adjustments
- Environmental modifications

**Prevention Strategies:**
- Long-term prevention measures
- Crop rotation suggestions
- Resistant varieties (if applicable)

**Important Notes:**
- Safety precautions when applying treatments
- Expected recovery timeline

Keep the response clear, actionable, and under 400 words. Focus on practical solutions that home gardeners and farmers can implement."""

    try:
        response = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert plant pathologist with extensive knowledge of plant diseases, their treatments, and prevention strategies. Provide clear, actionable advice."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.7,
            max_tokens=600,
            top_p=0.9
        )
        
        return response.choices[0].message.content
    
    except Exception as e:
        return f"Unable to generate remedy at this time. Please consult with a local agricultural extension office for treatment advice for {disease_name}."


@app.post("/predict/")
async def predict(file: UploadFile = File(...)):
    # Read the uploaded file into memory
    img_bytes = await file.read()

    # Use BytesIO to treat the in-memory file as if it were a file
    img = image.load_img(
        BytesIO(img_bytes), target_size=(224, 224)
    )
    img_array = image.img_to_array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    # Predict using the model
    prediction = model.predict(img_array)
    predicted_class = np.argmax(prediction)
    confidence = float(np.max(prediction))

    # Load class labels
    with open(LABELS_PATH) as f:
        class_labels = f.read().splitlines()

    disease_name = class_labels[predicted_class]
    
    # Generate AI-powered remedy
    remedy = generate_remedy(disease_name)

    return {
        "predicted_class": disease_name,
        "confidence": confidence,
        "remedy": remedy
    }
