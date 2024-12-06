from flask import Flask, request, jsonify
from flask_cors import CORS  # Importez CORS depuis flask_cors
from Classification.Alfred import recommend_products
import itertools

app = Flask(__name__)
CORS(app, resources={r'/*': {'origins': '*'}}) # Activez CORS pour l'ensemble de l'application

def generate_personality_combinations(user_responses):
    personality_question = "Comment définiriez-vous sa personnalité ?"
    personality_responses = user_responses.get(personality_question, [])

    if not isinstance(personality_responses, list):
        personality_responses = [personality_responses]

    return personality_responses

@app.route('/alfred', methods=['POST'])
def alfred_route():
    try:
        data = request.get_json()

        personality_responses = generate_personality_combinations(data)

        # Appeler recommend_products pour chaque réponse de personnalité
        all_results = []
        for personality in personality_responses:
            user_responses_copy = data.copy()
            user_responses_copy["Comment définiriez-vous sa personnalité ?"] = personality
            result = recommend_products(user_responses_copy)
            all_results.extend(result["recommended_products"])

        return jsonify(all_results), 200

    except Exception as e:
        # Gérez les erreurs imprévues
        error_result = {"status": "error", "message": str(e)}
        return jsonify(error_result), 400

@app.route('/')
def home_route():
    return 'Serveur running'

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
