from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import os
import json
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

app   = Flask(__name__)
CORS(app, supports_credentials=True)

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# ─── Load ML artefacts ───────────────────────────────────────────────────────
base_dir = os.path.dirname(__file__)

def load_pkl(rel_path):
    with open(os.path.join(base_dir, rel_path), 'rb') as f:
        return pickle.load(f)

model         = load_pkl('../model/model.pkl')
scaler        = load_pkl('../model/scaler.pkl')
columns       = load_pkl('../model/columns.pkl')
logistic_model = load_pkl('../model/logistic.pkl')


# ─── Helpers ──────────────────────────────────────────────────────────────────

def safe_float(val, default=0.0):
    try:
        return float(val)
    except (TypeError, ValueError):
        return default

# Map qualitative frontend values → rough numeric approximations
# so the existing trained model still works even though it was trained
# on numeric data (employees, revenue, customers, funding $M).

FUNDING_STAGE_MAP = {
    "Bootstrapped": 0,
    "Seed":         0.5,
    "Series A+":    5.0,
    # legacy values the model may have seen in training
    "Series A":     2.0,
    "Series B":     8.0,
}

CUSTOMER_VALIDATION_MAP = {
    "No users":         0,
    "Early users":      0.01,   # ~10k early users → 0.01M
    "Paying customers": 0.05,
}

TEAM_SIZE_REVENUE_MAP = {
    # rough annual revenue ($M) based on startup stage
    "Idea":     0,
    "MVP":      0.05,
    "Revenue":  0.5,
    "Scaling":  2.0,
}


def build_feature_vector(data: dict) -> np.ndarray:
    """
    Map the 15+ qualitative fields the frontend sends into the numeric
    feature vector the trained model expects.
    """
    # ── Raw inputs ──────────────────────────────────────────────────────────
    funding_usd   = safe_float(data.get('fundingAmount', 0))
    funding_m     = funding_usd / 1_000_000          # convert $ → $M

    team_size     = max(safe_float(data.get('teamSize', 1)), 1)

    startup_stage = data.get('startupStage', 'Idea')
    revenue_m     = TEAM_SIZE_REVENUE_MAP.get(startup_stage, 0)

    customer_val  = data.get('customerValidation', 'No users')
    customers_m   = CUSTOMER_VALIDATION_MAP.get(customer_val, 0)

    funding_stage = data.get('fundingStage', 'Bootstrapped')
    funding_num   = FUNDING_STAGE_MAP.get(funding_stage, 0)

    industry      = data.get('industry', 'Other')
    stage         = data.get('startupStage', 'Seed')

    # ── Build full feature dict (all zeros first) ────────────────────────────
    input_dict = {col: 0 for col in columns}

    # Core numeric features
    input_dict['Total Funding ($M)']        = max(funding_m, funding_num)
    input_dict['Number of Employees']       = team_size
    input_dict['Annual Revenue ($M)']       = revenue_m
    input_dict['Customer Base (Millions)']  = customers_m

    # Engineered features (same as training)
    input_dict['Funding_per_Employee']  = input_dict['Total Funding ($M)']       / (team_size + 1)
    input_dict['Revenue_per_Employee']  = input_dict['Annual Revenue ($M)']      / (team_size + 1)
    input_dict['Revenue_to_Funding']    = input_dict['Annual Revenue ($M)']      / (input_dict['Total Funding ($M)'] + 1)
    input_dict['Revenue_per_Customer']  = input_dict['Annual Revenue ($M)']      / (customers_m + 1)

    # One-hot: industry
    industry_col = f'Industry_{industry}'
    if industry_col in input_dict:
        input_dict[industry_col] = 1

    # One-hot: funding stage (model was trained on "Seed", "Series A" etc.)
    stage_col = f'Funding Stage_{funding_stage}'
    if stage_col in input_dict:
        input_dict[stage_col] = 1

    return np.array([list(input_dict.values())])


# ─── Routes ───────────────────────────────────────────────────────────────────

@app.route('/')
def home():
    return "Startup X-Ray Backend Running ✅"


@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json(force=True)
        if not data:
            return jsonify({"error": "No JSON body received"}), 400

        features = build_feature_vector(data)
        features_scaled = scaler.transform(features)

        prediction  = model.predict(features_scaled)[0]
        probability = logistic_model.predict_proba(features_scaled)[0][1]

        return jsonify({
            "prediction":  int(prediction),
            "probability": float(probability)
        })

    except Exception as e:
        print("PREDICT ERROR:", str(e))
        return jsonify({"error": str(e)}), 500


@app.route('/analyze-idea', methods=['POST'])
def analyze_idea():
    """
    Uses OpenAI to dynamically analyze any startup idea.
    Returns: industry, problem, solution, insight, summary — all specific
    to what the user actually typed, not hardcoded.
    """
    try:
        data = request.get_json(force=True)
        idea = data.get('idea', '').strip()

        if not idea:
            return jsonify({"error": "No idea provided"}), 400

        prompt = f"""You are a startup analyst. A founder described their idea as:
"{idea}"

Respond with ONLY a JSON object — no markdown, no explanation, no extra text.
Use this exact structure:
{{
  "industry": "2-3 word industry label (e.g. EdTech / AI)",
  "problem": "One sentence: what problem this solves for users",
  "solution": "One sentence: how this idea solves that problem",
  "insight": "One sentence: a key market or trend insight supporting this idea",
  "summary": "One sentence summary of the startup concept"
}}"""

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.4,
            max_tokens=300
        )

        raw = response.choices[0].message.content.strip()

        # Strip markdown fences if model adds them anyway
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
        raw = raw.strip()

        result = json.loads(raw)
        return jsonify(result)

    except json.JSONDecodeError:
        # If OpenAI returns non-JSON for some reason, return a safe fallback
        return jsonify({
            "industry": "Technology",
            "problem":  "Solving a real user need in the market",
            "solution": f"An AI-powered platform: {idea[:80]}",
            "insight":  "Digital adoption is creating strong tailwinds for this space",
            "summary":  f"Early-stage startup: {idea[:100]}"
        })

    except Exception as e:
        print("ANALYZE ERROR:", str(e))
        return jsonify({"error": str(e)}), 500


# ─── Run ──────────────────────────────────────────────────────────────────────
if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
