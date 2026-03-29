import os
import geopandas as gpd
from sqlalchemy import create_engine
from dotenv import load_dotenv

# Charger le .env
load_dotenv()

# Variables d'environnement
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")
DB_NAME = os.getenv("DB_NAME")

print("Chargement du GPKG MAJIC...")

gdf = gpd.read_file(
    "data/parcelles_personnes_morales_2025.gpkg"
)

print("Connexion à PostGIS...")

engine = create_engine(
    f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
)

print("Import dans la base...")

gdf.to_postgis(
    "majic",
    engine,
    if_exists="replace",
    index=False
)

print("Import MAJIC terminé")