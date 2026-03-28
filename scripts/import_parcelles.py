import geopandas as gpd
import psycopg2
from sqlalchemy import create_engine

# CONFIG
DB_USER = "postgres"
DB_PASSWORD = "root"
DB_HOST = "localhost"
DB_PORT = "5432"
DB_NAME = "cadastre"

# fichier
file_path = r"C:\Users\amaur\Documents\Amaury Polytech\Projet parcelles\cadastre.json"

print("Chargement du GeoJSON...")
gdf = gpd.read_file(file_path)

print("Connexion à PostGIS...")
engine = create_engine(
    f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
)

print("Import des données...")
gdf.to_postgis(
    name="parcelles",
    con=engine,
    if_exists="replace",
    index=False
)

print("Import terminé")