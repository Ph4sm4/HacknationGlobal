from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score, precision_score, recall_score, f1_score
import joblib

from dataloader import DataLoader

class Classificator:
    def __init__(self, data_path, safe_data_path, safe_data_n, test_size = 0.3):
        self.x_train, self.x_test, self.y_train, self.y_test = (DataLoader(data_path, safe_data_path, safe_data_n, test_size).get_ready_data())
        self.rf = None

    def train(self, n_estimators, random_state = 42):
        self.rf = RandomForestClassifier(n_estimators = n_estimators, random_state = random_state)
        self.rf.fit(self.x_train, self.y_train)

        self.save_model()

    def evaluate(self):
        if self.rf is None:
            print("Model is not trained or loaded.")
            return
        
        y_pred = self.rf.predict(self.x_test)
        
        print("=== Classification Report ===")
        print(classification_report(self.y_test, y_pred))
        
        tn, fp, fn, tp = confusion_matrix(self.y_test, y_pred).ravel()
        print("=== Confusion Matrix ===")
        print(f"True Positives (TP): {tp}")
        print(f"True Negatives (TN): {tn}")
        print(f"False Positives (FP): {fp}")
        print(f"False Negatives (FN): {fn}")
        
        acc = accuracy_score(self.y_test, y_pred)
        prec = precision_score(self.y_test, y_pred)
        rec = recall_score(self.y_test, y_pred)
        f1 = f1_score(self.y_test, y_pred)
        
        print("=== Additional Metrics ===")
        print(f"Accuracy: {acc:.4f}")
        print(f"Precision: {prec:.4f}")
        print(f"Recall: {rec:.4f}")
        print(f"F1-score: {f1:.4f}")

    def save_model(self, filename = "random_forest_model.joblib"):
        if self.rf is None:
            print("Model is not trained.")
            return

        joblib.dump(self.rf, filename)
        print(f"Model successfully saved to {filename}")

    def load_model(self, filename = 'random_forest_model.joblib'):
        try:
            self.rf = joblib.load(filename)
            print(f"Model successfully loaded from {filename}")
            return True
        except FileNotFoundError:
            print(f"Error: Model file '{filename}' not found.")
            return False