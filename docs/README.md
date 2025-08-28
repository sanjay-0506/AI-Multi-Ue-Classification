## Architecture

- Stacking ensemble model combining XGBoost, LightGBM, and Logistic Regression.
- Features: Flow-based metrics, log-transforms, interaction features, ratios, and aggregated statistics.
- Input: Real-time network traffic metrics.
- Output: Predicted traffic type, confidence, and recommended action.

![alt text](model_architecture.png)

---

## Data Flow

1. Collect network traffic metrics from multiple UEs.
2. Preprocess and feature engineering using `preprocess.py` and `feature_engineering.py`.
3. Model predicts traffic type and confidence.
4. Web interface displays results and allows export (PDF/CSV).

![alt text](flow_diagram.png)

---

## Results

- Accuracy: 97.5%
- Balanced Accuracy: 97.24%
- Detailed classification report and confusion matrix included in `documentation_report.pdf`.

---

## Usage

- For running the app, refer to `src/README.md`.