# Dockerfile
FROM python:3.9

RUN pip install flask pandas scikit-learn flask-cors
RUN useradd -m vscode -u 1000 -g users

# Copiez le script entrypoint.sh dans le conteneur
# COPY /entrypoint.sh /app/entrypoint.sh
# RUN chmod 777 ./entrypoint.sh
COPY ./entrypoint.sh /tmp



EXPOSE 8000

# Démarrez le script pour déboguer
CMD ["./tmp/entrypoint.sh"]


# Dockerfile

# FROM python:3.9

# # Créez un utilisateur vscode avec l'UID/GID 1000
# RUN useradd -m vscode -u 1000 -g users

# # Copiez le script serveur.py dans le conteneur
# COPY ./serveur.py /app/serveur.py

# # Changer le répertoire de travail
# WORKDIR /app

# # Exposez le port sur lequel le serveur écoute
# EXPOSE 8000

# # Donner les droits d'exécution au script
# RUN chmod +x serveur.py

# # Commande pour exécuter le serveur
# CMD ["python", "serveur.py"]
