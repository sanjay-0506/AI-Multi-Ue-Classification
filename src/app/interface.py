# interface.py
from flask import Flask, render_template, jsonify
from joblib import load
import numpy as np
from preprocess import df_test, FEATURE_COLUMNS, current_index, BATCH_SIZE, TRAFFIC_LABELS, get_confidence_level, get_action

app = Flask(__name__)
model = load("model.joblib")  # your trained stacking model

# Flask routes
@app.route("/")
def index():
    return render_template("index.html")

@app.route("/about")
def about():
    return render_template("about.html")

@app.route('/contact')
def contact():
    return render_template('contact.html')

@app.route('/header')
def header():
    return render_template('header.html')

@app.route("/simulate")
def simulate():
    global current_index
    results = []

    batch = df_test.iloc[current_index: current_index + BATCH_SIZE]
    current_index += BATCH_SIZE

    for idx, row in batch.iterrows():
        features = row[FEATURE_COLUMNS].values.reshape(1, -1)

        if hasattr(model, "predict_proba"):
            probs = model.predict_proba(features)[0]
            pred_index = np.argmax(probs)
            pred_prob = probs[pred_index] * 100
        else:
            pred_index = model.predict(features)[0] - 1
            pred_prob = 100.0

        pred_label = TRAFFIC_LABELS.get(pred_index + 1, "Unknown")

        results.append({
            "row": idx + 1,
            "prediction": pred_label,
            "probability": f"{pred_prob:.2f}%",
            "confidence": get_confidence_level(pred_prob),
            "action": get_action(pred_label)
        })

    if current_index >= len(df_test):
        current_index = 0

    return jsonify({"results": results})
