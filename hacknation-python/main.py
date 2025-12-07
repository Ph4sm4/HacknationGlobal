from classificator import Classificator
from dataloader import DataLoader

def main():
    # https://data.mendeley.com/datasets/vfszbj9b36/1
    # https://www.kaggle.com/datasets/adebayo/cisco-umbrella-list

    model = Classificator("data/URL dataset.csv", "data/top-1m.csv", 200)
    # model.train(n_estimators = 3)
    # model.evaluate()

    model.load_model()
    model.evaluate()

if __name__ == '__main__':
    main()