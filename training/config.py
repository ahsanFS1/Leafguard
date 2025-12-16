import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(BASE_DIR)

DATASET_ROOT = os.path.join(
    PROJECT_ROOT,
    "data",
    "raw",
    "New Plant Diseases Dataset(Augmented)",
    "New Plant Diseases Dataset(Augmented)"
)

TRAIN_DIR = os.path.join(DATASET_ROOT, "train")
VAL_DIR   = os.path.join(DATASET_ROOT, "valid")
IMG_SIZE = 224
BATCH_SIZE = 32

EPOCHS_HEAD = 20
EPOCHS_FINE = 10

LEARNING_RATE_HEAD = 1e-3
LEARNING_RATE_FINE = 1e-5

VALIDATION_SPLIT = 0.15
SEED = 42
