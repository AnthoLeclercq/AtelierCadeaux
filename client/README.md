# Microservice de Géolocalisation

Ce microservice permet de convertir une adresse standard en coordonnées géographiques (latitude et longitude) à l'aide de l'API [Geoapify](https://www.geoapify.com) et d'afficher l'emplacement sur une carte à l'aide de Google Maps. Il simplifie le processus de géocodage inversé et la visualisation des adresses sur une carte.

## Fonctionnalités

- **Géocodage Inversé** : Convertit une adresse standard (par exemple, "07 Rue Maurice") en coordonnées géographiques (latitude et longitude) en utilisant l'API Geoapify.
- **Visualisation sur Carte** : Affiche l'adresse en tant que repère sur une carte Google Maps après obtention des coordonnées.

## Pré-requis

Avant de lancer le microservice, assurez-vous d'avoir les éléments suivants :

1. Une clé API Geoapify pour le géocodage inversé.
2. Une clé API Google Maps pour afficher la carte.

## Démarrage

### 1. Configuration Geoapify

Pour utiliser Geoapify pour le géocodage inversé, suivez ces étapes :

1. Visitez [Geoapify](https://www.geoapify.com).
2. Cliquez sur "Sign Up" et complétez le processus d'inscription.
3. Une fois connecté, allez dans "My Projects" et créez un nouveau projet.
4. Après avoir créé un projet, une clé API sera générée automatiquement. Copiez cette clé pour une utilisation ultérieure.

### 2. Configuration Google Maps

Vous aurez besoin d'installer react-native-maps via :   
 ```bash
    npm install react-native-maps
  ```
Ensuite vous utiliser <MapView> de react-native-maps pour afficher la carte.