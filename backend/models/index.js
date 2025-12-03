const fs = require("fs");
const path = require("path");
const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,
  }
);

const db = {};

// Dynamically import all models
fs.readdirSync(__dirname)
  .filter((file) => file !== "index.js" && file.endsWith(".js"))
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, DataTypes);
    db[model.name] = model;
  });

sequelize
  .sync({ alter: true }) // OR { force: true } to drop & recreate tables
  .then(() => {
    console.log("All tables created successfully.");
  })
  .catch((err) => {
    console.error("Error creating tables:", err);
  });


db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
