from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

app = Flask(__name__)
CORS(app, supports_credentials=True)


# Base directory
base_dir = os.path.dirname(__file__)

# Paths
model_path = os.path.join(base_dir, '..', 'model', 'model.pkl')
scaler_path = os.path.join(base_dir, '..', 'model', 'scaler.pkl')
columns_path = os.path.join(base_dir, '..', 'model', 'columns.pkl')
logistic_path = os.path.join(base_dir, '..', 'model', 'logistic.pkl')

# Load models
with open(model_path, 'rb') as f:
    model = pickle.load(f)

with open(scaler_path, 'rb') as f:
    scaler = pickle.load(f)

with open(columns_path, 'rb') as f:
    columns = pickle.load(f)

with open(logistic_path, 'rb') as f:
    logistic_model = pickle.load(f)


@app.route('/')
def home():
    return "Startup X-Ray Backend Running"


@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()

        # ✅ Get values safely
        funding_stage = data.get('fundingStage')
        investor_quality = data.get('investorQuality')
        competition = data.get('competition')

        # ✅ Mappings (adjust if needed)
        funding_map = {
            "Bootstrapped": 0,
            "Seed": 1,
            "Series A": 2,
            "Series B": 3
        }

        investor_map = {
            "Low": 0,
            "Medium": 1,
            "High": 2
        }

        competition_map = {
            "Low": 0,
            "Medium": 1,
            "High": 2
        }

        # ✅ Convert to numbers
        funding = funding_map.get(funding_stage, 0)
        investor = investor_map.get(investor_quality, 0)
        comp = competition_map.get(competition, 1)

        # ✅ Create feature vector (MATCH your model training shape)
        features = np.array([[funding, investor, comp]])

        # ⚠️ If your model was trained with scaler → keep this
        features = scaler.transform(features)

        # ✅ Predictions
        prediction = model.predict(features)[0]
        probability = logistic_model.predict_proba(features)[0][1]

        return jsonify({
            "prediction": int(prediction),
            "probability": float(probability)
        })

    except Exception as e:
        print("ERROR:", str(e))
        return jsonify({"error": str(e)}), 500



@app.route('/analyze-idea', methods=['POST'])
def analyze_idea():
    data = request.json
    idea = data.get('idea', '')

    return jsonify({
        "industry": "EdTech / AI",
        "problem": "Students struggle with choosing career paths and managing academic decisions",
        "solution": "An AI-powered platform that analyzes skills and interests to guide students",
        "insight": "The demand for personalized education and career guidance is rapidly increasing",
        "summary": f"An AI-based platform to help students with: {idea}"
    })

import os

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)



    
