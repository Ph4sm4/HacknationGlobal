import joblib
import Levenshtein
import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI(title = "URL Safety Checker")

SAFE_DATA_N = 200

try:
    rf_model = joblib.load("random_forest_model.joblib")
except FileNotFoundError:
    raise RuntimeError("Model file not found.")

try:
    safe_df = pd.read_csv("data/top-1m.csv", index_col = 0)
    SAFE_URLS = safe_df.index.to_series().astype(str).head(SAFE_DATA_N).tolist()
    if not SAFE_URLS:
        raise ValueError("Safe URL list is empty.")
except FileNotFoundError:
    raise RuntimeError(f"Safe data file not found. Cannot compute Levenshtein feature.")
except Exception as e:
    raise RuntimeError(f"Error loading safe URLs: {e}")

class URLRequest(BaseModel):
    url: str

def compute_shannon_entropy(values):
    values = np.array(values, dtype = float)
    probs = values / values.sum()
    return -np.sum(probs * np.log2(probs + 1e-12))

def min_levenshtein_to_safe(url: str, safe_urls_list: list) -> int:
    distances = [Levenshtein.distance(url, safe_url) for safe_url in safe_urls_list]
    return min(distances)

def extract_features_from_url(url: str):
    total_length = len(url)
    num_dots = url.count(".")
    num_hyphens = url.count("-")
    https = int(url.startswith("https://"))
    www = int("www." in url.lower())
    php = int(".php" in url.lower())
    queeries = url.count("?")
    base_features = [total_length, num_dots, num_hyphens, https, www, php, queeries]
    entropy = compute_shannon_entropy(base_features)
    min_leven = min_levenshtein_to_safe(url, SAFE_URLS)
    final_features = base_features + [entropy, min_leven]
    print("Features:", final_features)
    return final_features

@app.post("/check_url")
def check_url(request: URLRequest):
    url = request.url
    try:
        x = [extract_features_from_url(url)]
        prediction = rf_model.predict(x)[0]
        result = "Potencjalnie bezpieczna - zalecane ostrożne postępowanie." if prediction == 1 else "Potencjalnie niebiezpiecnza - zalecana szczególna ostrożność."
        return {"url": url, "prediction": result}
    except Exception as e:
        raise HTTPException(status_code = 500, detail = str(e))