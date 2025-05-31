const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    dialect: "mssql",
    dialectOptions: {
      options: { trustServerCertificate: true },
    },
    logging: false,
  }
);

module.exports = sequelize;
