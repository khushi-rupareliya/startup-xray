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

        # Safe gets (NO crash)
        funding = data.get('fundingStage', 0)
        employees = data.get('employees', 1)
        revenue = data.get('revenue', 1)
        customers = data.get('customers', 1)
        industry = data.get('industry', 'Other')
        stage = data.get('stage', 'Seed')

        # Convert funding stage to number
        funding_map = {
            "Bootstrapped": 0,
            "Seed": 1,
            "Series A": 2,
            "Series B": 3
        }
        funding = funding_map.get(funding, 0)

        # Create full feature dictionary
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

        # Scale
        features = scaler.transform(features)

        # Predict
        prediction = model.predict(features)[0]
        probability = logistic_model.predict_proba(features)[0][1]

        return jsonify({
            "prediction": int(prediction),
            "probability": float(probability)
        })

    except Exception as e:
        print("ERROR:", str(e))
        return jsonify({"error": str(e)}), 500

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



    
