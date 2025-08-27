# preprocess.py
import pandas as pd
from feature_engineering import feature_engineering

# Load and preprocess test data
TEST_FILE = "network_traffic_dataset.xlsx"
df_test = pd.read_excel(TEST_FILE)
df_test = feature_engineering(df_test)

# Feature columns (all except label)
FEATURE_COLUMNS = [col for col in df_test.columns if col != "label"]

# Globals
current_index = 0
BATCH_SIZE = 100

# Mapping numbers to traffic labels
TRAFFIC_LABELS = {
    1: 'BROWSING', 2: 'CHAT', 3: 'FT', 4: 'MAIL', 5: 'P2P', 6: 'STREAMING', 7: 'VOIP',
    8: 'VPN-BROWSING', 9: 'VPN-CHAT', 10: 'VPN-FT', 11: 'VPN-MAIL', 12: 'VPN-P2P',
    13: 'VPN-STREAMING', 14: 'VPN-VOIP'
}

def get_confidence_level(prob):
    if prob >= 85:
        return "High"
    elif prob >= 80:
        return "Medium"
    else:
        return "Low"

def get_action(pred_label):
    if "VPN" in pred_label or pred_label in ["P2P", "FT"]:
        return "Monitor"
    elif pred_label in ["MAIL", "CHAT"]:
        return "Caution"
    else:
        return "Allow"
