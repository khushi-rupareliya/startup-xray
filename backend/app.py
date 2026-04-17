from http import client

from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import os
from openai import OpenAI

from dotenv import load_dotenv
import os

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
    data = request.json

    funding = data['funding']
    employees = data['employees']
    revenue = data['revenue']
    customers = data['customers']
    industry = data['industry']
    stage = data['stage']

    # Create feature dictionary (all columns = 0)
    input_dict = {col: 0 for col in columns}

    # Base features
    input_dict['Total Funding ($M)'] = funding
    input_dict['Number of Employees'] = employees
    input_dict['Annual Revenue ($M)'] = revenue
    input_dict['Customer Base (Millions)'] = customers

    # Engineered features
    input_dict['Funding_per_Employee'] = funding / (employees + 1)
    input_dict['Revenue_per_Employee'] = revenue / (employees + 1)
    input_dict['Revenue_to_Funding'] = revenue / (funding + 1)
    input_dict['Revenue_per_Customer'] = revenue / (customers + 1)

    # Industry encoding
    industry_col = f'Industry_{industry}'
    if industry_col in input_dict:
        input_dict[industry_col] = 1

    # Stage encoding
    stage_col = f'Funding Stage_{stage}'
    if stage_col in input_dict:
        input_dict[stage_col] = 1

    # Convert to array
    features = np.array([list(input_dict.values())])

    print("Feature length:", len(features[0]))

    # Scale input
    features = scaler.transform(features)

    # Random Forest → prediction
    prediction = model.predict(features)[0]

    # Logistic Regression → smooth probability
    probability = logistic_model.predict_proba(features)[0][0]

    # Adjust probability for better UX
    adjusted_probability = 0.5 + (probability - 0.5) * 1.3
    adjusted_probability = max(0.1, min(0.95, adjusted_probability))

    return jsonify({
        "prediction": int(prediction),
        "probability": float(adjusted_probability)
    })



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



    
