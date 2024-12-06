from flask import Flask, request, jsonify
import os
import joblib
from transformers import AutoTokenizer, AutoModel
import torch
import logging

app = Flask(__name__)

MODEL_NAME = "camembert-base"
CACHE_DIR = "/app/hf_cache"
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PARENT_DIR = os.path.dirname(BASE_DIR)
MODEL_DIR = os.path.join(PARENT_DIR, "saved_models")
ENCODERS_DIR = os.path.join(MODEL_DIR, "encoders")
USER_FEATURES = ["Sexe", "Age", "Personnalite", "TypePreference", "Personnalisation"]

# Initialize logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize tokenizer and model variables
tokenizer = None
bert_model = None

def load_tokenizer_model():
    global tokenizer, bert_model
    if tokenizer is None or bert_model is None:
        try:
            tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME, cache_dir=CACHE_DIR)
            bert_model = AutoModel.from_pretrained(MODEL_NAME, cache_dir=CACHE_DIR)
        except Exception as e:
            logger.error(f"Error loading tokenizer or model: {e}")
            raise

# Load classification models and label encoders
models = {}
label_encoders = {}

for feature in USER_FEATURES:
    try:
        models[feature] = joblib.load(os.path.join(MODEL_DIR, f"{feature}_model.pkl"))
    except FileNotFoundError:
        logger.error(f"Model file for {feature} not found.")
    except Exception as e:
        logger.error(f"Error loading model for {feature}: {e}")

for feature in ["Age", "Personnalisation", "Personnalite", "Sexe", "TypePreference"]:
    try:
        label_encoders[feature] = joblib.load(os.path.join(ENCODERS_DIR, f"{feature}_encoder.pkl"))
    except FileNotFoundError:
        logger.error(f"Label encoder file for {feature} not found.")
    except Exception as e:
        logger.error(f"Error loading label encoder for {feature}: {e}")

def encode_descriptions(texts, tokenizer, bert_model):
    encoded = tokenizer.batch_encode_plus(
        texts, padding=True, truncation=True, max_length=512, return_tensors="pt"
    )
    with torch.no_grad():
        output = bert_model(**encoded)
    return output.last_hidden_state[:, 0, :].numpy()

def predict(product_name):
    load_tokenizer_model()
    product_embedding = encode_descriptions([product_name], tokenizer, bert_model)
    prediction = {}
    for feature in USER_FEATURES:
        if feature not in models or feature not in label_encoders:
            prediction[feature] = "Model or encoder missing"
            continue
        try:
            numeric_prediction = models[feature].predict(product_embedding)[0]
            text_label = label_encoders[feature].inverse_transform([numeric_prediction])[0]
            prediction[feature] = text_label
        except Exception as e:
            prediction[feature] = f"Prediction error: {e}"
    prediction["Produits"] = product_name
    return prediction

@app.route('/predict', methods=['POST'])
def predict_route():
    data = request.get_json()
    product_name = data.get('product_name')
    if not product_name:
        return jsonify({'error': 'No product name provided'}), 400
    
    prediction = predict(product_name)
    return jsonify(prediction)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002)
