import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from config import VAL_DIR, IMG_SIZE, BATCH_SIZE, MODEL_PATH

# Load the model
model = tf.keras.models.load_model(MODEL_PATH)

# Prepare the validation data generator
val_datagen = ImageDataGenerator(rescale=1.0/255)
val_gen = val_datagen.flow_from_directory(
    VAL_DIR,
    target_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE,
    class_mode="categorical",
    shuffle=False
)

# Evaluate the model
val_loss, val_accuracy = model.evaluate(val_gen)
print(f"Validation Accuracy: {val_accuracy * 100:.2f}%")
print(f"Validation Loss: {val_loss:.4f}")
