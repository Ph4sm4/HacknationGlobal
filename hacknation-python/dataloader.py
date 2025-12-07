import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
import Levenshtein

class DataLoader:
    def __init__(self, data_path, safe_data_path, safe_data_n, test_size = 0.3):
        self.data_path = data_path
        self.safe_data_path = safe_data_path
        self.safe_data_n = safe_data_n
        self.test_size = test_size
        self.data = None
        self.x_train = None
        self.x_test = None
        self.y_train = None
        self.y_test = None

        self.init_loader()

    def load_data(self):
        self.data = pd.read_csv(self.data_path, index_col = 0)
        return self.data
    
    def load_safe_urls(self):
        safe_df = pd.read_csv(self.safe_data_path, index_col = 0)
        self.safe_urls = safe_df.index.to_series().astype(str).head(self.safe_data_n).tolist()

    def compute_row_entropy(self, row):
        values = row.values
        probs = values / values.sum()
        return -np.sum(probs * np.log2(probs + 1e-12))

    def min_levenshtein_to_safe(self, url):
        if not self.safe_urls:
            return 0
        distances = [Levenshtein.distance(url, safe_url) for safe_url in self.safe_urls]
        return min(distances)

    def extract_features(self):
        if self.data is None:
            self.load_data()

        x = self.data.drop(columns = ["safe", "type"])
        y = self.data["safe"]
        x["shannon_entropy"] = x.apply(self.compute_row_entropy, axis = 1)

        url_series = self.data.index.to_series().astype(str)
        x["min_safe_levenshtein"] = url_series.apply(self.min_levenshtein_to_safe)
        return x, y

    def split(self):
        x, y = self.extract_features()
        self.x_train, self.x_test, self.y_train, self.y_test = train_test_split(x, y, test_size = self.test_size, random_state = 42, shuffle = True)
        return self.x_train, self.x_test, self.y_train, self.y_test

    def init_loader(self):
        self.load_data()
        self.load_safe_urls()
        self.split()

    def get_ready_data(self):
        return self.x_train, self.x_test, self.y_train, self.y_test