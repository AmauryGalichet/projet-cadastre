# Projet Cadastre Aisne (02)

## Objectif

Développer une application web permettant d'afficher les parcelles cadastrales du département de l'Aisne (02), avec une architecture complète :

* Base de données PostGIS
* API backend
* Interface web interactive

---

## Technologies utilisées

* PostgreSQL + PostGIS
* Node.js (Express)
* Leaflet
* OpenStreetMap

---

## Données

Données issues de :
cadastre.data.gouv.fr (Parcellaire cadastral ouvert)

---

## Installation

### 1. Base de données

Créer une base PostgreSQL :

```sql
CREATE DATABASE cadastre;
CREATE EXTENSION postgis;
```

Importer les données avec :

```bash
python scripts/import_parcelles.py
```

---

### 2. Backend

```bash
cd backend
npm install
node server.js
```

API disponible sur :
http://localhost:3000

---

### 3. Frontend

Ouvrir :

```bash
frontend/index.html
```

---

## API

### GET /parcelles

Paramètre :

* bbox=xmin,ymin,xmax,ymax

Retourne les parcelles en GeoJSON

---

## Fonctionnalités

* Affichage des parcelles cadastrales
* Chargement dynamique selon la carte
* Interaction utilisateur

---

## Améliorations possibles

* Ajout des données MAJIC
* Connexion API SIREN
* Optimisation avec vector tiles

---
