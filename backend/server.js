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

  if (!bbox) {
    return res.status(400).json({ error: "bbox manquant" });
  }

  const [xmin, ymin, xmax, ymax] = bbox.split(",").map(Number);

  const query = `
    SELECT id, commune, section, numero,
    ST_AsGeoJSON(geometry) as geom
    FROM parcelles
    WHERE geometry && ST_MakeEnvelope($1,$2,$3,$4,4326)
    LIMIT 200
  `;

  const result = await pool.query(query, [xmin, ymin, xmax, ymax]);

  res.json(result.rows);
});

app.listen(3000, () => console.log("API running on port 3000"));