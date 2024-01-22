# Authentification-API de recette 
d'authentification à l'API de gestion des cours déjà en place, développée à l'aide d'Express.js et MongoDB. Cette extension vise à permettre la création d'utilisateurs, à assurer une authentification sécurisée par le biais de mécanismes tels que JWT, et à garantir la protection des routes sensibles. Seuls les utilisateurs authentifiés auront l'autorisation d'accéder et d'effectuer des opérations telles que la création, la mise à jour ou la suppression de recettes. Une mise à jour de la documentation sera réalisée afin d'inclure des instructions claires sur la procédure d'authentification, l'obtention d'un jeton, ainsi que l'utilisation de ce dernier pour accéder aux fonctionnalités protégées. L'objectif global est de renforcer la sécurité de l'API tout en fournissant un contrôle d'accès aux fonctionnalités sensibles.
# Installation
Clonez le projet depuis le référentiel.
Installez les dépendances avec la commande : npm install
# Configuration
1) Créez un fichier .env à la racine du projet.
2) Ajoutez les variables d'environnement nécessaires, par exemple :
   " PORT=3010
DB_NAME=nom_de_votre_base_de_données
PASSWORD=votre_mot_de_passe
SECRET_KEY=votre_clé_secrète_pour_les_tokens "

# Scripts 
"npm start" : Démarre le serveur en utilisant nodemon pour le rechargement automatique.

# Technologies Utilisées
Express.js: Framework web pour Node.js.
MongoDB: Base de données NoSQL.
Mongoose: Bibliothèque pour l'accès à MongoDB.
jsonwebtoken: Génération et vérification des JWT.

# Documentation
Le projet exploite Swagger afin de créer une documentation interactive pour son API. Swagger UI Express, défini parmi les dépendances principales, est employé pour une représentation visuelle des points de terminaison de l'API. Pour consulter la documentation Swagger, veuillez suivre ces instructions :

Vérifiez que le serveur est actif, puis ouvrez l'URL suivante dans votre navigateur : http://localhost:3010/apidocs/ : 


<img width="1440" alt="Capture d’écran 2024-01-22 à 20 56 22" src="https://github.com/Mehdi-012/Authentification-API/assets/116653283/2daa5b32-0629-441f-beb5-dcf15d029503">
