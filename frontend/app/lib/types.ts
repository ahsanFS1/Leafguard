export interface PredictionResponse {
    predicted_class: string;
    confidence: number;
    remedy: string;
}

export interface ApiError {
    message: string;
    details?: string;
}
