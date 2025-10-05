# 🎨 Guide de Génération de Visualisations par l'IA Kimi

## Vue d'ensemble

Le chatbot du Laboratoire utilise maintenant Kimi pour générer **dynamiquement** le contenu des visualisations. L'IA décide quand et comment afficher des graphiques, tableaux ou jauges interactives.

## Format de Réponse de l'IA

L'IA peut inclure des visualisations dans ses réponses en utilisant ce format :

```
[Texte de réponse normal]

---VISUALIZATION---
{
  "type": "chart" | "table" | "gauge",
  "data": { ... }
}
---END---
```

## Types de Visualisations

### 1. 📊 Graphiques (Chart)

**Format attendu :**
```json
{
  "type": "chart",
  "data": {
    "title": "Titre du graphique",
    "points": [
      {"x": 3.8, "y": 4.2, "label": "O-type", "color": "#9b59b6"},
      {"x": 3.9, "y": 4.0, "label": "B-type", "color": "#3498db"}
    ]
  }
}
```

**Exemples d'utilisation :**
- Diagramme de Hertzsprung-Russell
- Distribution des exoplanètes par taille
- Évolution stellaire
- Comparaison de distances

### 2. 📋 Tableaux (Table)

**Format attendu :**
```json
{
  "type": "table",
  "data": {
    "title": "Titre du tableau",
    "columns": ["Colonne 1", "Colonne 2", "Colonne 3"],
    "rows": [
      ["Valeur 1", "Valeur 2", "Valeur 3"],
      ["Valeur 4", "Valeur 5", "Valeur 6"]
    ]
  }
}
```

**Exemples d'utilisation :**
- Liste des étoiles proches
- Comparaison de propriétés planétaires
- Missions spatiales et leurs dates
- Caractéristiques des types spectraux

### 3. 🌡️ Jauges (Gauge)

**Format attendu :**
```json
{
  "type": "gauge",
  "data": {
    "value": 5778,
    "min": 2000,
    "max": 30000,
    "label": "Température Effective du Soleil",
    "unit": "K"
  }
}
```

**Exemples d'utilisation :**
- Température stellaire
- Distance en années-lumière
- Masse en masses solaires
- Rayon en rayons terrestres

## Exemples de Questions et Réponses

### Exemple 1 : Classification Stellaire

**Question utilisateur :** "Explique-moi la classification stellaire"

**Réponse IA attendue :**
```
La classification stellaire, aussi appelée classification spectrale, organise les étoiles selon leur température de surface et leurs caractéristiques spectrales. Le système le plus utilisé est la classification de Harvard, qui utilise les lettres O, B, A, F, G, K, M (du plus chaud au plus froid).

---VISUALIZATION---
{
  "type": "chart",
  "data": {
    "title": "Diagramme de Hertzsprung-Russell",
    "points": [
      {"x": 3.8, "y": 4.2, "label": "Type O (30000-50000 K)", "color": "#9b59b6"},
      {"x": 3.9, "y": 4.0, "label": "Type B (10000-30000 K)", "color": "#3498db"},
      {"x": 4.0, "y": 3.8, "label": "Type A (7500-10000 K)", "color": "#2ecc71"},
      {"x": 4.2, "y": 3.5, "label": "Type F (6000-7500 K)", "color": "#f1c40f"},
      {"x": 4.4, "y": 3.2, "label": "Type G - Soleil (5200-6000 K)", "color": "#e67e22"},
      {"x": 4.6, "y": 2.8, "label": "Type K (3700-5200 K)", "color": "#e74c3c"},
      {"x": 4.8, "y": 2.5, "label": "Type M (2400-3700 K)", "color": "#95a5a6"}
    ]
  }
}
---END---
```

### Exemple 2 : Température du Soleil

**Question utilisateur :** "Quelle est la température du Soleil ?"

**Réponse IA attendue :**
```
Le Soleil a une température effective de surface d'environ 5778 Kelvin (5505°C). Cette température le classe comme une étoile de type G2V, communément appelée "naine jaune".

---VISUALIZATION---
{
  "type": "gauge",
  "data": {
    "value": 5778,
    "min": 2000,
    "max": 30000,
    "label": "Température Effective du Soleil",
    "unit": "K"
  }
}
---END---
```

### Exemple 3 : Étoiles Proches

**Question utilisateur :** "Quelles sont les étoiles les plus proches de nous ?"

**Réponse IA attendue :**
```
Les étoiles les plus proches du système solaire sont principalement des naines rouges de type M. Voici les systèmes stellaires les plus proches :

---VISUALIZATION---
{
  "type": "table",
  "data": {
    "title": "Systèmes Stellaires les Plus Proches",
    "columns": ["Système", "Distance (années-lumière)", "Type Spectral", "Exoplanètes"],
    "rows": [
      ["Proxima Centauri", "4.24", "M5.5V", "1 confirmée"],
      ["Alpha Centauri A/B", "4.37", "G2V / K1V", "1 candidate"],
      ["Étoile de Barnard", "5.96", "M4.0V", "1 candidate"],
      ["Wolf 359", "7.86", "M6.5V", "0"],
      ["Lalande 21185", "8.29", "M2.0V", "0"]
    ]
  }
}
---END---
```

## Avantages de Cette Approche

### ✅ **Contenu Dynamique**
- L'IA génère des données pertinentes selon le contexte
- Pas de données statiques pré-codées
- Réponses toujours à jour et précises

### ✅ **Intelligence Contextuelle**
- L'IA décide quand une visualisation est appropriée
- Choix automatique du type de visualisation optimal
- Adaptation au niveau de détail demandé

### ✅ **Flexibilité**
- Nouvelles visualisations sans modifier le code
- Données scientifiques précises générées par l'IA
- Support de questions complexes et variées

## Notes Techniques

### Parsing de la Réponse

Le service Kimi parse automatiquement la réponse :
```typescript
const vizMatch = response.match(/---VISUALIZATION---([\s\S]*?)---END---/);
if (vizMatch) {
  const vizData = JSON.parse(vizMatch[1].trim());
  // Utilise vizData pour créer la visualisation
}
```

### Gestion des Erreurs

Si le JSON est invalide ou manquant :
- Le système affiche uniquement le texte
- Pas de crash, dégradation gracieuse
- Message d'erreur dans la console pour debug

### Extensibilité

Pour ajouter de nouveaux types de visualisations :
1. Ajouter le type dans `kimiService.ts`
2. Ajouter le rendu dans `Laboratory.tsx`
3. Mettre à jour le prompt système pour l'IA

## Exemples de Tests

Essayez ces questions pour tester les visualisations :

**Graphiques :**
- "Montre-moi la classification stellaire"
- "Compare les tailles des planètes du système solaire"
- "Diagramme HR des types d'étoiles"

**Tableaux :**
- "Liste les exoplanètes habitables connues"
- "Quelles sont les missions spatiales récentes ?"
- "Compare les étoiles proches"

**Jauges :**
- "Quelle est la température de Sirius ?"
- "Montre-moi la distance de Proxima Centauri"
- "Température des différents types d'étoiles"

## Conclusion

Le système de Generative UI piloté par l'IA permet des réponses riches et interactives, entièrement générées par Kimi selon le contexte de la question. C'est une véritable **IA conversationnelle avec visualisations intelligentes** ! 🚀✨
