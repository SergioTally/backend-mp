const express = require("express");
const sql = require("mssql");
const cors = require("cors");
require("dotenv").config();
const fs = require("fs");
const path = require("path");

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(express.json());

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  database: process.env.DB_NAME,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

const routesPath = path.join(__dirname, "src/routes");

fs.readdirSync(routesPath).forEach((file) => {
  if (file.endsWith(".routes.js")) {
    const route = require(path.join(routesPath, file));
    const routeName = `/api/${file.replace(".routes.js", "")}`;
    app.use(routeName, route);
  }
});

app.get("/api", async (req, res) => {
  try {
    await sql.connect(config);
    const result = await sql.query("SELECT GETDATE() AS fecha");
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.listen(4000, () => console.log("API escuchando en puerto 4000"));
