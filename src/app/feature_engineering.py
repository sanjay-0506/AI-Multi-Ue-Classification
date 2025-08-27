# feature_engineering.py
import numpy as np
import pandas as pd

def feature_engineering(df):
    # Ratio-based features
    df['bytes_per_packet'] = df['flowBytesPerSecond'] / (df['flowPktsPerSecond'] + 1e-6)
    df['pkts_per_duration'] = df['flowPktsPerSecond'] / (df['duration'] + 1e-6)
    df['bytes_per_duration'] = df['flowBytesPerSecond'] / (df['duration'] + 1e-6)
    df['fiat_biat_ratio'] = (df['total_fiat'] + 1e-6) / (df['total_biat'] + 1e-6)

    # Log transforms
    df['log_flowBytesPerSecond'] = np.log1p(df['flowBytesPerSecond'])
    df['log_duration'] = np.log1p(df['duration'])
    df['log_flowPktsPerSecond'] = np.log1p(df['flowPktsPerSecond'])
    df['log_total_fiat'] = np.log1p(df['total_fiat'])
    df['log_total_biat'] = np.log1p(df['total_biat'])

    # Interaction features
    df['fiat_interaction'] = df['min_fiat'] * df['mean_fiat']
    df['biat_interaction'] = df['min_biat'] * df['total_biat']
    df['iat_ratio'] = df['mean_flowiat'] / (df['std_flowiat'] + 1e-6)
    df['iat_mixed'] = df['min_flowiat'] * df['max_flowiat']
    df['iat_range'] = df['max_flowiat'] - df['min_flowiat']

    # Statistical transformations
    df['fiat_to_duration'] = df['total_fiat'] / (df['duration'] + 1e-6)
    df['biat_to_duration'] = df['total_biat'] / (df['duration'] + 1e-6)
    df['flowiat_cv'] = df['std_flowiat'] / (df['mean_flowiat'] + 1e-6)

    # Normalized ratios
    df['normalized_bytes'] = df['flowBytesPerSecond'] / (df['flowBytesPerSecond'].max() + 1e-6)
    df['normalized_packets'] = df['flowPktsPerSecond'] / (df['flowPktsPerSecond'].max() + 1e-6)

    # Aggregated combinations
    df['activity_score'] = (df['flowPktsPerSecond'] + df['flowBytesPerSecond']) / (df['duration'] + 1e-6)
    df['iat_activity'] = df['mean_flowiat'] * df['flowPktsPerSecond']

    return df
