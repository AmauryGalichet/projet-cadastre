const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
app.use(cors());

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "cadastre",
  password: "root",
  port: 5432,
});

// Endpoint pour récupérer les parcelles dans une bbox
app.get("/parcelles", async (req, res) => {
  const { bbox } = req.query;

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
});

app.get("/majic", async (req, res) => {
  const { commune, section, numero } = req.query;

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
});

app.listen(3000, () => console.log("API running on port 3000"));