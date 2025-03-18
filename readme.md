# My_IRC

My_IRC est une application de chat en temps réel inspirée des fonctionnalités d'un client IRC (Internet Relay Chat). Ce projet est composé d'une interface utilisateur développée avec React et d'un serveur backend utilisant Node.js et Socket.IO.

## Fonctionnalités

- **Gestion des utilisateurs** :
  - Choix d'un pseudonyme unique.
  - Modification du pseudonyme avec la commande `/nick`.

- **Gestion des canaux** :
  - Création de canaux avec `/create [nom_du_canal]`.
  - Suppression de canaux avec `/delete [nom_du_canal]`.
  - Rejoindre un canal avec `/join [nom_du_canal]`.
  - Quitter un canal avec `/leave [nom_du_canal]`.
  - Renommer un canal avec `/rename [ancien_nom] [nouveau_nom]`.
  - Liste des canaux disponibles avec `/list`.

- **Messagerie** :
  - Envoi de messages publics dans les canaux.
  - Envoi de messages privés avec `/msg [pseudonyme] [message]`.

- **Notifications** :
  - Notifications globales pour les événements importants (ex. : création ou suppression de canaux).
  - Alertes d'erreur en cas d'actions invalides.

- **Interface utilisateur** :
  - Interface moderne et responsive grâce à Tailwind CSS.
  - Modales pour les actions comme la création de canaux ou l'affichage des utilisateurs.

## Structure du Projet

### Client

Le client est une application React située dans le dossier `client/`. Elle utilise Socket.IO pour communiquer avec le serveur en temps réel.

- **Dépendances principales** :
  - React
  - Socket.IO Client
  - Tailwind CSS
  - React Icons

- **Commandes disponibles** :
  - `npm start` : Lancer l'application en mode développement.
  - `npm run build` : Construire l'application pour la production.

### Serveur

Le serveur est une application Node.js située dans le dossier `server/`. Il utilise Socket.IO pour gérer les connexions en temps réel et Express pour la configuration du serveur HTTP.

- **Dépendances principales** :
  - Express
  - Socket.IO

- **Commandes disponibles** :
  - `npm start` : Lancer le serveur.

## Installation

1. Clonez le dépôt :
   ```bash
   git clone <url_du_dépôt>
   cd My_IRC

2. Installez les dépendances pour le client et le serveur :
   ```bash
   cd client
   npm install
   cd ../server
   npm install
   ```

3. Lancez le serveur :
   ```bash
   cd server
   npm start
   ```

4. Lancez le client :
   ```bash
   cd client
   npm start
   ```

5. Ouvrez votre navigateur à l'adresse [http://localhost:3000](http://localhost:3000).

## Utilisation

- Entrez un pseudonyme pour commencer.
- Utilisez les commandes disponibles dans la messagerie pour interagir avec l'application.
- Consultez le bouton d'aide pour afficher la liste des commandes disponibles.

## Contributions

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request pour proposer des améliorations.
