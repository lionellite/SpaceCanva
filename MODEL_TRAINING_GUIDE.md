# 🧠 Guide de Réentraînement du Modèle

## 🎯 Vue d'ensemble

Le système permet de réentraîner le modèle d'exoplanètes sur de nouveaux datasets directement depuis l'Expert Workspace.

## 📊 Architecture du Training

### Composants

```
backend/
├── training.py           # Logique d'entraînement
├── training_routes.py    # API endpoints
├── database.py           # Tables training_sessions & datasets
├── uploads/              # Datasets uploadés
└── model/                # Modèles sauvegardés
```

### Tables de Base de Données

**training_sessions**
- Suivi des sessions d'entraînement
- Statut : pending, training, completed, failed
- Métriques de performance

**datasets**
- Datasets uploadés par workspace
- Métadonnées (taille, nombre d'échantillons)

## 📋 Format du Dataset CSV

### Colonnes Requises

```csv
period,duration,depth,impact,snr,steff,srad,slogg,tmag,label
3.52,2.5,1000,0.5,15.2,5778,1.0,4.5,12.5,1
```

### Description des Colonnes

| Colonne | Type | Unité | Description |
|---------|------|-------|-------------|
| `period` | float | jours | Période orbitale |
| `duration` | float | heures | Durée du transit |
| `depth` | float | ppm | Profondeur du transit |
| `impact` | float | - | Paramètre d'impact (0-1) |
| `snr` | float | - | Rapport signal/bruit |
| `steff` | float | K | Température stellaire |
| `srad` | float | R☉ | Rayon stellaire |
| `slogg` | float | dex | Log g stellaire |
| `tmag` | float | mag | Magnitude T |
| `label` | int | - | **0**=CANDIDATE, **1**=CONFIRMED, **2**=FALSE POSITIVE |

### Encodage des Labels

```python
0 = CANDIDATE      # Candidat à confirmer
1 = CONFIRMED      # Exoplanète confirmée
2 = FALSE POSITIVE # Faux positif
```

## 🚀 API Endpoints

### 1. Upload Dataset

**POST** `/api/training/upload-dataset`

Upload un fichier CSV pour l'entraînement.

**Headers:**
```
Authorization: Bearer <clerk_token>
Content-Type: multipart/form-data
```

**Form Data:**
```
file: <CSV file>
workspace_key: abc123...
name: "My Training Dataset" (optional)
```

**Response (201):**
```json
{
  "success": true,
  "dataset": {
    "id": 1,
    "name": "My Training Dataset",
    "file_size": 12345,
    "num_samples": 1000
  },
  "message": "Dataset uploaded successfully"
}
```

### 2. List Datasets

**GET** `/api/training/datasets?workspace_key=abc123`

Liste tous les datasets d'un workspace.

**Response (200):**
```json
{
  "success": true,
  "datasets": [
    {
      "id": 1,
      "name": "Kepler Dataset",
      "file_size": 12345,
      "num_samples": 1000,
      "uploaded_at": "2025-01-05T10:00:00"
    }
  ],
  "count": 1
}
```

### 3. Start Training

**POST** `/api/training/start`

Démarre l'entraînement sur un dataset.

**Request Body:**
```json
{
  "workspace_key": "abc123...",
  "dataset_id": 1,
  "model_name": "my_exoplanet_model",
  "epochs": 50
}
```

**Response (202):**
```json
{
  "success": true,
  "message": "Training started in background",
  "dataset": {...},
  "model_name": "my_exoplanet_model",
  "epochs": 50
}
```

### 4. List Training Sessions

**GET** `/api/training/sessions?workspace_key=abc123`

Liste toutes les sessions d'entraînement.

**Response (200):**
```json
{
  "success": true,
  "sessions": [
    {
      "id": 1,
      "model_name": "my_exoplanet_model",
      "dataset_size": 1000,
      "status": "completed",
      "model_path": "/path/to/model.keras",
      "metrics": "{\"accuracy\": 0.95}",
      "epochs_completed": 50,
      "created_at": "2025-01-05T10:00:00",
      "completed_at": "2025-01-05T11:30:00"
    }
  ],
  "count": 1
}
```

### 5. Get Training Session

**GET** `/api/training/session/<session_id>`

Détails d'une session spécifique.

## 🔄 Workflow Complet

### 1. Préparer le Dataset

```python
# Créer un CSV avec les colonnes requises
import pandas as pd

data = {
    'period': [3.52, 5.21, 2.87],
    'duration': [2.5, 3.1, 1.8],
    'depth': [1000, 850, 1200],
    'impact': [0.5, 0.3, 0.7],
    'snr': [15.2, 18.5, 12.3],
    'steff': [5778, 6100, 5500],
    'srad': [1.0, 1.2, 0.9],
    'slogg': [4.5, 4.3, 4.6],
    'tmag': [12.5, 11.8, 13.2],
    'label': [1, 1, 0]  # 1=CONFIRMED, 0=CANDIDATE
}

df = pd.DataFrame(data)
df.to_csv('my_dataset.csv', index=False)
```

### 2. Upload via API

```bash
curl -X POST http://localhost:5000/api/training/upload-dataset \
  -H "Authorization: Bearer <token>" \
  -F "file=@my_dataset.csv" \
  -F "workspace_key=abc123" \
  -F "name=My Training Dataset"
```

### 3. Démarrer l'Entraînement

```bash
curl -X POST http://localhost:5000/api/training/start \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "workspace_key": "abc123",
    "dataset_id": 1,
    "model_name": "improved_model",
    "epochs": 50
  }'
```

### 4. Suivre la Progression

```bash
curl -X GET "http://localhost:5000/api/training/sessions?workspace_key=abc123" \
  -H "Authorization: Bearer <token>"
```

## 🏗️ Architecture du Modèle

### Inputs

1. **curve_input** : (batch, 2001, 1)
   - Courbe de transit générée automatiquement
   - Créée à partir de period, duration, depth

2. **feat_input** : (batch, 6)
   - Features : impact, snr, steff, srad, slogg, tmag

### Outputs

1. **label** : (batch, 3)
   - Softmax classification
   - 3 classes : CANDIDATE, CONFIRMED, FALSE POSITIVE

2. **period_out** : (batch, 1)
   - Régression de la période

3. **depth_out** : (batch, 1)
   - Régression de la profondeur

### Architecture CNN

```
curve_input → Conv1D(32) → MaxPool → Conv1D(64) → MaxPool → Conv1D(128) → GlobalAvgPool
                                                                                ↓
feat_input → Dense(64) → Dropout → Dense(32) ────────────────────────────────→ Concat
                                                                                ↓
                                                                    Dense(128) → Dropout → Dense(64)
                                                                                ↓
                                                        ┌──────────────────────┼──────────────────────┐
                                                        ↓                      ↓                      ↓
                                                   label (3)            period_out (1)          depth_out (1)
```

## 📊 Métriques de Performance

### Loss Functions

```python
losses = {
    'label': 'categorical_crossentropy',  # Classification
    'period_out': 'mse',                  # Régression période
    'depth_out': 'mse'                    # Régression profondeur
}

loss_weights = {
    'label': 1.0,      # Priorité principale
    'period_out': 0.5,
    'depth_out': 0.5
}
```

### Métriques Suivies

- **Accuracy** : Précision de classification
- **Val Accuracy** : Précision sur validation
- **Loss** : Perte totale
- **MAE** : Erreur absolue moyenne (régression)

## 🔧 Configuration

### Paramètres d'Entraînement

```python
CURVE_LENGTH = 2001        # Points dans la courbe
BATCH_SIZE = 32            # Taille des batches
EPOCHS = 50                # Nombre d'époques
VALIDATION_SPLIT = 0.2     # 20% pour validation
```

### Callbacks

1. **EarlyStopping**
   - Arrête si val_accuracy ne s'améliore pas pendant 10 époques
   - Restaure les meilleurs poids

2. **ReduceLROnPlateau**
   - Réduit le learning rate si perte stagne
   - Factor: 0.5, Patience: 5

3. **TrainingProgressCallback**
   - Met à jour la DB toutes les 5 époques

## 💾 Sauvegarde des Modèles

### Nommage

```
model/
├── exoplanet_model.keras              # Modèle actuel (utilisé par l'API)
├── my_model_20250105_103000.keras     # Modèle avec timestamp
└── improved_model_20250105_143000.keras
```

### Chargement Automatique

Le modèle `exoplanet_model.keras` est chargé automatiquement au démarrage du backend.

## 🧪 Test de l'Entraînement

### 1. Utiliser l'Exemple

```bash
cd backend

# Upload l'exemple
curl -X POST http://localhost:5000/api/training/upload-dataset \
  -H "Authorization: Bearer test_user_123" \
  -F "file=@example_dataset.csv" \
  -F "workspace_key=YOUR_KEY" \
  -F "name=Example Dataset"

# Démarrer l'entraînement
curl -X POST http://localhost:5000/api/training/start \
  -H "Authorization: Bearer test_user_123" \
  -H "Content-Type: application/json" \
  -d '{
    "workspace_key": "YOUR_KEY",
    "dataset_id": 1,
    "epochs": 10
  }'
```

### 2. Suivre les Logs

```bash
# Dans le terminal du backend
# Vous verrez :
🚀 Starting model training...
🏗️ Creating model architecture...
🎯 Training for 10 epochs...
Epoch 1/10 ...
✅ Training completed!
💾 Model saved to: model/exoplanet_model_20250105_103000.keras
```

## 🆘 Dépannage

### "Missing required columns"

**Cause** : CSV mal formaté
**Solution** : Vérifiez que toutes les colonnes sont présentes

### "Training failed"

**Cause** : Données invalides ou mémoire insuffisante
**Solution** : 
- Vérifiez les valeurs (pas de NaN)
- Réduisez BATCH_SIZE si mémoire insuffisante

### "Model not found"

**Cause** : Modèle pas encore sauvegardé
**Solution** : Attendez la fin de l'entraînement

## 📈 Bonnes Pratiques

1. **Dataset Balancé**
   - Équilibrez les 3 classes (CANDIDATE, CONFIRMED, FALSE POSITIVE)
   - Minimum 100 exemples par classe

2. **Validation**
   - Gardez 20% pour validation
   - Ne jamais entraîner sur les données de test

3. **Hyperparamètres**
   - Commencez avec 50 époques
   - Augmentez si underfitting
   - Réduisez si overfitting

4. **Monitoring**
   - Surveillez val_accuracy vs accuracy
   - Si écart trop grand → overfitting

Le système de réentraînement est **opérationnel** ! 🎉
