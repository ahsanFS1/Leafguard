from fastapi import FastAPI, File, UploadFile
from tensorflow.keras.preprocessing import image
import numpy as np
from tensorflow.keras.models import load_model
from io import BytesIO

from training.config import LABELS_PATH, MODEL_PATH  # To handle in-memory files

app = FastAPI()

# Load the trained model
model = load_model(MODEL_PATH)


@app.post("/predict/")
async def predict(file: UploadFile = File(...)):
    # Read the uploaded file into memory
    img_bytes = await file.read()

    # Use BytesIO to treat the in-memory file as if it were a file
    img = image.load_img(
        BytesIO(img_bytes), target_size=(224, 224)
    )  # Adjust the target size to your model's input
    img_array = image.img_to_array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    # Predict using the model
    prediction = model.predict(img_array)
    predicted_class = np.argmax(prediction)

    # Load class labels
    with open(LABELS_PATH) as f:
        class_labels = f.read().splitlines()

    return {"predicted_class": class_labels[predicted_class]}
