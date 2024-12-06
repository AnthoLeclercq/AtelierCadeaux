# Utiliser une image de base Python
FROM python:3.9-slim

# Définir le répertoire de travail
WORKDIR /app

# Installer les dépendances système nécessaires
RUN apt-get update && \
    apt-get install -y \
    git \
    && apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copier les fichiers de dépendances et installer les dépendances
COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Définir le cache Hugging Face pour utiliser un répertoire avec suffisamment d'espace
ENV HF_HOME=/app/hf_cache

# Pré-télécharger les modèles Hugging Face pendant la construction de l'image
RUN python -c "from transformers import AutoTokenizer, AutoModel; \
    AutoTokenizer.from_pretrained('camembert-base', cache_dir='/app/hf_cache'); \
    AutoModel.from_pretrained('camembert-base', cache_dir='/app/hf_cache')"

# Copier le code source de l'API
COPY API_Classification/ .

# Nettoyer les fichiers temporaires après le téléchargement
RUN apt-get autoremove -y && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* /root/.cache/pip

# Exposer le port que l'application utilisera
EXPOSE 5002

# Commande pour démarrer l'application
CMD ["python", "API_Classification/api_classification.py"]



