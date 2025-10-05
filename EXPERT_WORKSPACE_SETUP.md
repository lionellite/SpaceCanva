# 🔐 Expert Workspace - Guide de Configuration

## 🎯 Vue d'ensemble

L'Expert Workspace permet aux utilisateurs authentifiés via Clerk de créer des espaces de travail personnels pour analyser des exoplanètes, avec historique et sauvegarde des résultats.

## 📦 Architecture

```
Backend:
├── database.py          # Gestion SQLite (workspaces, analyses)
├── auth.py              # Authentification Clerk
├── workspace_routes.py  # Routes API workspace
└── app.py              # Application Flask principale

Frontend:
└── src/pages/Workspace.tsx  # Interface Expert Workspace
```

## 🚀 Installation Backend

### 1. Installer les dépendances

```bash
cd backend
pip install -r requirements.txt
```

Nouvelles dépendances ajoutées :
- `python-dotenv` : Variables d'environnement
- `requests` : Appels API Clerk

### 2. Configuration Clerk

Créez un fichier `.env` dans le dossier `backend/` :

```bash
cp .env.example .env
```

Éditez `.env` :
```env
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key
CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key
```

**Obtenir les clés Clerk :**
1. Allez sur [clerk.com](https://clerk.com)
2. Créez un projet ou utilisez un existant
3. Dans Dashboard → API Keys :
   - Copiez `Secret Key` → `CLERK_SECRET_KEY`
   - Copiez `Publishable Key` → `CLERK_PUBLISHABLE_KEY`

### 3. Initialiser la base de données

La base de données SQLite est créée automatiquement au premier démarrage :

```bash
python app.py
```

Vous verrez :
```
✅ Database initialized successfully
🚀 Starting Exoplanet Analysis Backend...
```

## 🔑 Authentification

### Flux d'authentification

```
1. Frontend → Clerk SignIn/SignUp
   ↓
2. Clerk → Retourne session token
   ↓
3. Frontend → Envoie token dans Authorization header
   ↓
4. Backend → Vérifie token avec Clerk API
   ↓
5. Backend → Extrait clerk_user_id
   ↓
6. Backend → Vérifie accès workspace
   ↓
7. Backend → Retourne données
```

### Mode Développement

Si `CLERK_SECRET_KEY` n'est pas défini :
- ⚠️ L'authentification est **désactivée**
- Le token est utilisé directement comme user_id
- Utile pour tester sans Clerk

**Exemple dev :**
```bash
curl -H "Authorization: Bearer test_user_123" \
  http://localhost:5000/api/workspace/list
```

## 📡 Endpoints Disponibles

### 1. Créer un workspace
```http
POST /api/workspace/create
Authorization: Bearer <clerk_token>

{
  "name": "Mon Workspace",
  "description": "Description optionnelle"
}
```

### 2. Lister mes workspaces
```http
GET /api/workspace/list
Authorization: Bearer <clerk_token>
```

### 3. Vérifier l'accès
```http
POST /api/workspace/verify
Authorization: Bearer <clerk_token>

{
  "workspace_key": "abc123..."
}
```

### 4. Analyser dans un workspace
```http
POST /api/workspace/analyze
Authorization: Bearer <clerk_token>

{
  "workspace_key": "abc123...",
  "analysis_type": "exoplanet_detection",
  "data": { ... }
}
```

### 5. Historique d'analyses
```http
GET /api/workspace/history?workspace_key=abc123&limit=50
Authorization: Bearer <clerk_token>
```

## 🗄️ Base de Données SQLite

### Tables

**workspaces**
- Stocke les workspaces des utilisateurs
- Lien avec `clerk_user_id`
- Clé unique `workspace_key` pour l'accès

**analysis_results**
- Historique des analyses
- Lien avec workspace
- Input/Output en JSON

**workspace_sessions** (future)
- Sessions de travail
- Sauvegarde d'état

**workspace_files** (future)
- Fichiers uploadés
- Datasets personnalisés

### Localisation

```
backend/workspace.db
```

### Inspection

```bash
sqlite3 backend/workspace.db

# Lister les tables
.tables

# Voir les workspaces
SELECT * FROM workspaces;

# Voir les analyses
SELECT * FROM analysis_results;
```

## 🔒 Sécurité

### Protection des endpoints

Tous les endpoints workspace utilisent les décorateurs :

```python
@require_auth              # Vérifie le token Clerk
@require_workspace_access  # Vérifie l'accès au workspace
```

### Isolation des données

- Chaque utilisateur voit **uniquement** ses workspaces
- Les `workspace_key` sont uniques et secrets
- Vérification systématique `clerk_user_id` + `workspace_key`

### Bonnes pratiques

1. ✅ **Ne jamais** exposer `workspace_key` publiquement
2. ✅ Utiliser HTTPS en production
3. ✅ Configurer CORS correctement
4. ✅ Définir `CLERK_SECRET_KEY` en production

## 🧪 Tests

### Test complet du workflow

```bash
# 1. Créer un workspace
curl -X POST http://localhost:5000/api/workspace/create \
  -H "Authorization: Bearer test_user_123" \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Workspace"}'

# Réponse : {"workspace_key": "abc123..."}

# 2. Lister les workspaces
curl -X GET http://localhost:5000/api/workspace/list \
  -H "Authorization: Bearer test_user_123"

# 3. Analyser
curl -X POST http://localhost:5000/api/workspace/analyze \
  -H "Authorization: Bearer test_user_123" \
  -H "Content-Type: application/json" \
  -d '{
    "workspace_key": "abc123...",
    "analysis_type": "exoplanet_detection",
    "data": {
      "period": 3.52,
      "duration": 2.5,
      "depth": 1000,
      "impact": 0.5,
      "snr": 15.2,
      "steff": 5778,
      "srad": 1.0,
      "slogg": 4.5,
      "tmag": 12.5
    }
  }'

# 4. Voir l'historique
curl -X GET "http://localhost:5000/api/workspace/history?workspace_key=abc123" \
  -H "Authorization: Bearer test_user_123"
```

## 🎨 Frontend Integration

### Exemple React avec Clerk

```typescript
import { useAuth } from '@clerk/clerk-react';

function ExpertWorkspace() {
  const { getToken, userId } = useAuth();
  
  const createWorkspace = async () => {
    const token = await getToken();
    
    const response = await fetch('http://localhost:5000/api/workspace/create', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'My Research Workspace',
        description: 'Analyzing Kepler candidates'
      })
    });
    
    const data = await response.json();
    console.log('Workspace created:', data.workspace);
    
    // Sauvegarder workspace_key pour usage futur
    localStorage.setItem('workspace_key', data.workspace.workspace_key);
  };
  
  const runAnalysis = async (exoplanetData) => {
    const token = await getToken();
    const workspaceKey = localStorage.getItem('workspace_key');
    
    const response = await fetch('http://localhost:5000/api/workspace/analyze', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        workspace_key: workspaceKey,
        analysis_type: 'exoplanet_detection',
        data: exoplanetData
      })
    });
    
    const result = await response.json();
    return result;
  };
  
  return (
    <div>
      <button onClick={createWorkspace}>Create Workspace</button>
      {/* ... */}
    </div>
  );
}
```

## 📊 Prochaines Étapes

1. ✅ Backend workspace avec authentification Clerk
2. ✅ Base de données SQLite
3. ✅ Endpoints API complets
4. 🔲 Frontend Expert Workspace UI
5. 🔲 Upload de fichiers CSV
6. 🔲 Visualisations d'historique
7. 🔲 Export de résultats

## 🆘 Dépannage

### Erreur : "No module named 'dotenv'"
```bash
pip install python-dotenv
```

### Erreur : "CLERK_SECRET_KEY not set"
- C'est normal en dev, l'auth est désactivée
- En prod, configurez `.env` avec vos clés Clerk

### Erreur : "Access denied"
- Vérifiez que le `workspace_key` est correct
- Vérifiez que le token Clerk est valide
- Vérifiez que le workspace appartient à l'utilisateur

### Base de données corrompue
```bash
rm backend/workspace.db
python app.py  # Recrée la DB
```

Le système Expert Workspace est maintenant **opérationnel** ! 🎉
