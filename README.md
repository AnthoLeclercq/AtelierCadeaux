# Groupe de lecler_a 1009989

# Prérequis

- MacOs : https://code.visualstudio.com/docs/setup/mac
- Windows : https://code.visualstudio.com/docs/setup/windows
- Linux : https://code.visualstudio.com/docs/setup/linux
- Installer l'application Expo sur votre smartphone

## Pour lancer le back :

1. cd server
2. code .  
   cela va ouvrir votre projet sur vscode (assurez vous d'avoir lancer docker desctop)
3. ctrl+shift P , ensuite Dev Containers: Reopen in container  
   cela va creer tout les container du projet et initialiser la db avec toutes les tables

### pour installer toutes les dependances:

4. npm insall  
5. npm start  
   l'application écoute sur : localhost:3000  
   vous pouvez vous rendre aussi sur : localhost:8080 , pour voir votre db grace à phpmyadmin

## Pour le front:

1. cd client
2. code .
3. ctrl+shift P , ensuite Dev Containers: Reopen in container
4. npm install
5. npx expo start --tunnel  
   scanner le qrCode pour commencé à dev ou bien appuiyez sur w pour ouvrir l'appli sur un naviagteur en local  

# Documentation 

## API

**Introduction :**  
Notre API est une API **RESTful** custom codée en **nodejs** qui répond aux besoins principaux d'une application **e-commerce**.  
Nous avons décider de partir sur un modèle **MVC** afin de s'y retrouver plus simplement dans l'architecture et facilitant ainsi  
le travail collaboratif.  

**Présentation de l'API :**  
Voici les différentes parties composant l'API :
- L'authentification (register / login)
- Les utilisateurs (clients, artisans, administrateurs)
- Les produits
- Les images (profil, produits)
- Les paniers
- Les commandes
- Les discussions (chat)
  
Pour chacunes de ces parties, nous retrouvons un  **CRUD** :  
- Create
- Read (all and by id)
- Update
- Delete
  
Nous avons également un dossier **helpers** qui vient centraliser des fichiers qui viennent nous **aider** dans le développement.  
Cela permet de faire du code **générique** qui sera utilisé au besoin.  
Nous retrouvons :  
- Le controle lié à l'authentification et le role assigné utilisé dans nos routes.
- Un fichier facilitant l'appel des méthodes pouvant être effectuées en one shot comme l'insertion des metas en db.
- Un fichier listant des méthodes génériques faites en fonction de nos besoins.
- Un fichier permettant la configuration des noms de fichier des images.
- Un fichier qui permettra de générer nos questions de manière dynamique.
  
## Tests unitaires
  
**Introduction :**  

