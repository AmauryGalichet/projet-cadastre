require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });

const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
app.use(cors());

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// =========================
// PARCELLES
// =========================
app.get("/parcelles", async (req, res) => {
  try {
    const { bbox } = req.query;

    if (!bbox) {
      return res.status(400).json({ error: "bbox manquante" });
    }

    const [xmin, ymin, xmax, ymax] = bbox.split(",").map(Number);

    const query = `
      SELECT 
        id,
        commune,
        section,
        numero,
        contenance,
        ST_AsGeoJSON(geometry) as geom
      FROM parcelles
      WHERE geometry && ST_MakeEnvelope($1,$2,$3,$4,4326)
      LIMIT 200
    `;

    const result = await pool.query(query, [xmin, ymin, xmax, ymax]);

    res.json(result.rows);

  } catch (err) {
    console.error("Erreur /parcelles:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// =========================
// MAJIC
// =========================
app.get("/majic", async (req, res) => {
  try {
    const { commune, section, numero } = req.query;

    if (!commune || !section || !numero) {
      return res.status(400).json({ error: "paramètres manquants" });
    }

    const query = `
      SELECT num_siren, denomination
      FROM majic
      WHERE code_commune = RIGHT($1, 3)
      AND section = $2
      AND num_plan = LPAD($3, 4, '0')
      LIMIT 5
    `;

    const result = await pool.query(query, [commune, section, numero]);

    res.json(result.rows);

  } catch (err) {
    console.error("Erreur /majic:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// =========================
// SIREN (INSEE)
// =========================
app.get("/siren/:siren", async (req, res) => {
  try {
    const { siren } = req.params;

    const response = await fetch(
      `https://api.insee.fr/api-sirene/3.11/siren/${siren}`,
      {
        headers: {
          "X-INSEE-Api-Key-Integration": process.env.INSEE_API_KEY,
          "Accept": "application/json"
        }
      }
    );

    const data = await response.json();
    const u = data.uniteLegale;
    const p = u?.periodesUniteLegale?.[0];

    res.json({
      siren,
      nom: p?.denominationUniteLegale || p?.nomUniteLegale || null,
      activite: p?.activitePrincipaleUniteLegale || null,
      type: p?.categorieJuridiqueUniteLegale || null,
      etat: p?.etatAdministratifUniteLegale === "A" ? "actif" : "fermé",
      date_creation: u?.dateCreationUniteLegale || null
    });

  } catch (err) {
    console.error("Erreur /siren:", err);
    res.status(500).json({ error: "Erreur API SIRENE" });
  }
});

app.listen(3000, () => console.log("API running on port 3000"));