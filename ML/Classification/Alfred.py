import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics.pairwise import cosine_similarity

def recommend_products(user_responses, top_n=5):
    # Charger les données à partir du fichier CSV
    data = pd.read_csv("./Classification/data.csv", delimiter=";")

    # Mapper les réponses aux questions avec les colonnes du fichier CSV
    question_mappings = {
        "Quel est le sexe de la personne à qui vous offrez le cadeau ?": "Sexe",
        "Quel est l'âge de la personne ?": "Age",
        "Comment définiriez-vous sa personnalité ?": "Personnalite",
        "Préférez-vous quelque chose de pratique, symbolique ou mémorable ?": "TypePreference",
        "Préférez-vous des produits personnalisés ?": "Personnalisation",
    }

    # Créer un LabelEncoder pour chaque colonne
    label_encoders = {
        col: LabelEncoder().fit(data[col]) for col in data.columns if col != "Produits"
    }

    # Fonction pour encoder les réponses aux questions
    def encode_responses(responses):
        return {
            col: label_encoders[col].transform([response])[0]
            for question, response in responses.items()
            if (col := question_mappings.get(question)) is not None
        }

    # Calculer les vecteurs de produits une fois, en utilisant les valeurs encodées
    product_vectors_encoded = np.array(
        [
            label_encoders[col].transform(data[col])
            for col in data.columns
            if col != "Produits"
        ]
    ).T

    # Fonction pour prédire les produits recommandés
    def predict_products(encoded_responses, top_n=5):
        user_vector = np.array(
            [encoded_responses[col] for col in data.columns if col != "Produits"]
        ).reshape(1, -1)

        # Utiliser la similarité cosinus entre user_vector et product_vectors_encoded
        similarities = cosine_similarity(user_vector, product_vectors_encoded)

        # Trier les produits en fonction de la similarité et retourner les top_n produits
        recommended_product_indices = np.argsort(-similarities[0])[:top_n]
        recommended_products = data["Produits"].iloc[recommended_product_indices].tolist()
        similarity_scores = -np.sort(-similarities[0])[:top_n]

        return recommended_products, similarity_scores

    # Utiliser ensuite les réponses pour suggérer les produits
    encoded_responses = encode_responses(user_responses)
    recommended_products, similarity_scores = predict_products(encoded_responses, top_n)

    # Construire le JSON de réponse
    response_json = {
        "recommended_products": recommended_products,
        "similarity_scores": similarity_scores.tolist(),
    }
    return response_json
