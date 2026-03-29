import geopandas as gpd
from sqlalchemy import create_engine

print("Chargement du GPKG MAJIC...")

gdf = gpd.read_file(
    "data/parcelles_personnes_morales_2025.gpkg"
)

print("Connexion à PostGIS...")

engine = create_engine(
    "postgresql://postgres:root@localhost:5432/cadastre"
)

print("Import dans la base...")

gdf.to_postgis(
    "majic",
    engine,
    if_exists="replace",
    index=False
)

print("Import MAJIC terminé")