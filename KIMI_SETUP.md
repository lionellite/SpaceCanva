# 🚀 Configuration de Kimi AI pour Cosmos Canvas

## Obtenir une clé API Kimi (Gratuite)

1. **Créer un compte** : Rendez-vous sur [https://kimi.moonshot.cn/](https://kimi.moonshot.cn/)
2. **Accéder aux paramètres API** : Une fois connecté, cherchez la section développeur/API
3. **Générer une clé API** : Créez une nouvelle clé API pour votre application
4. **Copier la clé** : Notez votre clé API (elle commence généralement par `sk-`)

## Configuration Locale

1. **Copier le fichier d'exemple** :
   ```bash
   cp .env.example .env
   ```

2. **Ajouter votre clé API** :
   ```bash
   # Dans le fichier .env
   VITE_KIMI_API_KEY=sk-votre-cle-api-ici
   ```

3. **Redémarrer le serveur** :
   ```bash
   npm run dev
   ```

## Fonctionnalités Kimi dans le Laboratoire

Une fois configuré, le chatbot du Laboratoire utilisera Kimi K1.5 pour :

- ✅ **Réponses intelligentes** sur l'astrophysique
- ✅ **Analyse contextuelle** des questions spatiales
- ✅ **Suggestions de visualisations** automatiques
- ✅ **Génération de composants UI** adaptés aux réponses

## Avantages de Kimi K1.5

- 🧠 **Modèle avancé** : Basé sur une architecture transformer moderne
- 🌍 **Support multilingue** : Excellent pour les questions en français
- 🔬 **Expertise scientifique** : Particulièrement doué pour les sujets techniques
- ⚡ **Réponses rapides** : Latence réduite pour une meilleure UX
- 💰 **Généreux quotas gratuits** : Parfait pour le développement

## Test de l'intégration

Dans la page Laboratoire, essayez de poser des questions comme :

- *"Qu'est-ce qu'une exoplanète ?"*
- *"Explique-moi la classification stellaire"*
- *"Comment mesure-t-on la température des étoiles ?"*
- *"Quelles sont les missions spatiales récentes ?"*

Le système générera automatiquement des visualisations appropriées selon le contenu de la réponse !
