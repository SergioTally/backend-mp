const express = require("express");
const sql = require("mssql");
const cors = require("cors");
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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

app.listen(4000, () => console.log("API escuchando en puerto 4000"));
