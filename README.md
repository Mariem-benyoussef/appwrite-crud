# Projet Frontend - Next.js

Ce projet est le frontend d'une application CRUD avec authentification, développé avec **Next.js**. Il interagit avec un backend Laravel pour la gestion des données et l'authentification des utilisateurs.

---

## Fonctionnalités

- **Authentification** : Connexion des utilisateurs.
- **Gestion des utilisateurs** : Deux rôles disponibles (Admin et User).
- **CRUD** : Création, lecture, mise à jour et suppression de tâches.
- **Permissions** : Accès restreint en fonction du rôle (Admin ou User).
- **Déploiement** : Déployé sur Vercel.

---

## Prérequis

Avant de commencer, assurez-vous d'avoir les éléments suivants installés sur votre machine :

- **Node.js** (version 16 ou supérieure)
- **npm** ou **yarn**

---

## Installation

### 1. Cloner le dépôt

Clonez ce dépôt sur votre machine locale :

```bash
git clone https://github.com/Mariem-benyoussef/appwrite-crud
cd appwrite-crud
2. Installer les dépendances
Installez toutes les dépendances nécessaires :

bash
Copy
npm install
# ou
yarn install
3. Configurer les variables d'environnement
Créez un fichier .env.local à la racine du projet et ajoutez les variables suivantes :

env
Copy
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_APP_NAME=MonProjet
4. Démarrer le serveur de développement
Lancez le serveur de développement :

bash
Copy
npm run dev
# ou
yarn dev
5. Accéder à l'application
Ouvrez votre navigateur et accédez à l'application à l'adresse suivante :

Copy
http://localhost:3000
Déploiement sur Vercel
Ce projet est configuré pour être déployé sur Vercel. Suivez ces étapes pour le déployer :

Connectez votre dépôt GitHub à Vercel.

Configurez les variables d'environnement dans les paramètres de Vercel :

NEXT_PUBLIC_API_URL : URL de l'API backend.

NEXT_PUBLIC_APP_NAME : Nom de l'application.

Déployez : Vercel redéploie automatiquement à chaque push sur la branche principale.

Technologies utilisées
Next.js : Framework React pour le rendu côté serveur.

React : Bibliothèque JavaScript pour l'interface utilisateur.

Tailwind CSS : Framework CSS utilitaire (optionnel).

Auteur
Mariem Ben Youssef
```
