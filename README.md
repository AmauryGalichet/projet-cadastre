# Projet Cadastre - Aisne (02)

## Description

Application web permettant d’afficher les parcelles cadastrales et d’accéder aux informations MAJIC et SIREN.

---

## 🧰 Technologies

* PostgreSQL / PostGIS
* Node.js / Express
* Leaflet
* OpenStreetMap
* API SIRENE (INSEE)
* Python (GeoPandas)

---

## 📥 Données

### PCI (Parcellaire Express)

https://cadastre.data.gouv.fr

### MAJIC (personnes morales)

Fichier GeoPackage contenant les SIREN

---

## 🗄️ Base de données

```sql
CREATE DATABASE cadastre;
\c cadastre;
CREATE EXTENSION postgis;
```

---

## 📥 Import des données

### Parcelles

```bash
python scripts/import_parcelles.py
```

### MAJIC

```bash
python scripts/import_majic.py
```

---

## 🔌 Backend

```bash
cd backend
npm install
node server.js
```

---

## 🌍 Frontend

```bash
cd frontend
python -m http.server 8000
```

http://localhost:8000

---

## ⚙️ API

### /parcelles

Retourne les parcelles (PostGIS)

### /majic

Retourne les données MAJIC (SIREN)

### /siren/:siren

Retourne les infos entreprise via API INSEE

---

## 🔐 Variables d’environnement

Créer `.env` :

```
INSEE_API_KEY=xxxx
DB_USER=postgres
DB_PASSWORD=xxx
```

---

## 🧠 Fonctionnement

1. Chargement des parcelles
2. Clic sur une parcelle :

   * récupération du SIREN (MAJIC)
   * appel API SIRENE
   * affichage des infos entreprise

---

## 🎯 Bonus

Intégration de l’API SIRENE permettant d’obtenir :

* nom de l’entreprise
* activité principale

---

## 👨‍💻 Auteur

Amaury Galichet
