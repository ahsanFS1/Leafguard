import os
import tensorflow as tf
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import Dense, Dropout, GlobalAveragePooling2D
from tensorflow.keras.models import Model
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint
from tensorflow.keras.optimizers import Adam

from config import (
    TRAIN_DIR,
    VAL_DIR,
    IMG_SIZE,
    BATCH_SIZE,
    EPOCHS_HEAD,
    EPOCHS_FINE,
    LEARNING_RATE_HEAD,
    LEARNING_RATE_FINE
)

# -------------------------
# Output paths
# -------------------------
MODEL_DIR = "../models"
MODEL_PATH = os.path.join(MODEL_DIR, "leafguard_mobilenetv2.h5")
LABELS_PATH = os.path.join(MODEL_DIR, "labels.txt")

os.makedirs(MODEL_DIR, exist_ok=True)

# -------------------------
# Data Generators
# -------------------------
train_datagen = ImageDataGenerator(
    rescale=1.0 / 255,
    rotation_range=25,
    width_shift_range=0.2,
    height_shift_range=0.2,
    zoom_range=0.2,
    horizontal_flip=True
)

val_datagen = ImageDataGenerator(
    rescale=1.0 / 255
)

train_gen = train_datagen.flow_from_directory(
    TRAIN_DIR,
    target_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE,
    class_mode="categorical",
    shuffle=True
)

val_gen = val_datagen.flow_from_directory(
    VAL_DIR,
    target_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE,
    class_mode="categorical",
    shuffle=False
)

NUM_CLASSES = train_gen.num_classes
print(f"Number of classes detected: {NUM_CLASSES}")

# -------------------------
# Base Model
# -------------------------
base_model = MobileNetV2(
    weights="imagenet",
    include_top=False,
    input_shape=(IMG_SIZE, IMG_SIZE, 3)
)

base_model.trainable = False

# -------------------------
# Custom Classification Head
# -------------------------
x = base_model.output
x = GlobalAveragePooling2D()(x)
x = Dense(256, activation="relu")(x)
x = Dropout(0.5)(x)
x = Dense(128, activation="relu")(x)
x = Dropout(0.3)(x)
outputs = Dense(NUM_CLASSES, activation="softmax")(x)

model = Model(inputs=base_model.input, outputs=outputs)

# -------------------------
# Compile (Phase 1)
# -------------------------
model.compile(
    optimizer=Adam(learning_rate=LEARNING_RATE_HEAD),
    loss="categorical_crossentropy",
    metrics=["accuracy"]
)

model.summary()

callbacks = [
    EarlyStopping(
        monitor="val_loss",
        patience=5,
        restore_best_weights=True
    ),
    ModelCheckpoint(
        MODEL_PATH,
        monitor="val_accuracy",
        save_best_only=True,
        verbose=1
    )
]

# -------------------------
# Phase 1: Train Head
# -------------------------
print("\n=== Training classification head ===\n")

model.fit(
    train_gen,
    validation_data=val_gen,
    epochs=EPOCHS_HEAD,
    callbacks=callbacks
)

# -------------------------
# Phase 2: Fine-Tuning
# -------------------------
print("\n=== Fine-tuning base model ===\n")

for layer in base_model.layers[-30:]:
    layer.trainable = True

model.compile(
    optimizer=Adam(learning_rate=LEARNING_RATE_FINE),
    loss="categorical_crossentropy",
    metrics=["accuracy"]
)

model.fit(
    train_gen,
    validation_data=val_gen,
    epochs=EPOCHS_FINE,
    callbacks=callbacks
)

# -------------------------
# Save Labels
# -------------------------
class_labels = train_gen.class_indices

with open(LABELS_PATH, "w") as f:
    for label in class_labels:
        f.write(label + "\n")

print("\nTraining complete.")
print(f"Model saved at: {MODEL_PATH}")
print(f"Labels saved at: {LABELS_PATH}")
