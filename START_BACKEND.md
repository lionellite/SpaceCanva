# 🚀 Démarrage du Backend d'Analyse d'Exoplanètes

## 📋 Prérequis

- Python 3.8+
- pip

## 🔧 Installation

### 1. Créer un environnement virtuel

```bash
cd backend
python -m venv venv
```

### 2. Activer l'environnement virtuel

**Linux/Mac:**
```bash
source venv/bin/activate
```

**Windows:**
```bash
venv\Scripts\activate
```

### 3. Installer les dépendances

```bash
pip install -r requirements.txt
```

### 4. Placer le modèle Keras

Placez votre fichier `exoplanet_model.keras` dans le dossier `backend/model/`

```bash
# Le fichier doit être ici:
backend/model/exoplanet_model.keras
```

## ▶️ Démarrer le serveur

```bash
python app.py
```

Le serveur démarre sur `http://localhost:5000`

Vous devriez voir :
```
🚀 Starting Exoplanet Analysis Backend...
📁 Model path: /path/to/backend/model/exoplanet_model.keras
✅ Model loaded successfully from /path/to/backend/model/exoplanet_model.keras
 * Running on http://0.0.0.0:5000
```

## 🧪 Tester l'API

### Health Check

```bash
curl http://localhost:5000/api/health
```

### Test de prédiction

```bash
curl -X POST http://localhost:5000/api/predict \
  -H "Content-Type: application/json" \
  -d '{
    "mission": "kepler",
    "period": 3.52,
    "duration": 2.5,
    "depth": 1000,
    "impact": 0.5,
    "snr": 15.2,
    "steff": 5778,
    "srad": 1.0,
    "slogg": 4.5,
    "tmag": 12.5
  }'
```

## 🔄 Workflow Complet

1. **Démarrer le backend** (terminal 1):
   ```bash
   cd backend
   source venv/bin/activate
   python app.py
   ```

2. **Démarrer le frontend** (terminal 2):
   ```bash
   npm run dev
   ```

3. **Utiliser l'application**:
   - Aller sur `http://localhost:8080/laboratory`
   - Demander "Comment vérifier si c'est une exoplanète ?"
   - Remplir le formulaire
   - Cliquer sur "Analyser le candidat"

## 📊 Format du Modèle

Le modèle Keras doit :
- Accepter 9 features en entrée (dans cet ordre):
  1. period (jours)
  2. duration (heures)
  3. depth (ppm)
  4. impact
  5. snr
  6. steff (K)
  7. srad (R☉)
  8. slogg (dex)
  9. tmag (mag)

- Retourner une probabilité entre 0 et 1
  - 0 = faux positif
  - 1 = exoplanète confirmée

## ⚠️ Dépannage

### Le modèle ne se charge pas

```
⚠️ Model file not found at backend/model/exoplanet_model.keras
```

**Solution**: Vérifiez que le fichier `exoplanet_model.keras` est bien dans `backend/model/`

### Erreur CORS

Si vous voyez des erreurs CORS dans le navigateur, vérifiez que `flask-cors` est installé :

```bash
pip install flask-cors
```

### Port déjà utilisé

Si le port 5000 est déjà utilisé, modifiez la dernière ligne de `app.py` :

```python
app.run(host='0.0.0.0', port=5001, debug=True)  # Changez 5000 en 5001
```

Et mettez à jour l'URL dans `Laboratory.tsx` :

```typescript
const response = await fetch('http://localhost:5001/api/predict', {
```

## 🎉 Succès !

Si tout fonctionne, vous devriez voir dans le chat :
1. Le texte explicatif de l'IA
2. Un tableau avec les données du candidat
3. Une jauge de confiance
4. Un composant personnalisé avec le résultat (Confirmed Exoplanet / False Positive)
