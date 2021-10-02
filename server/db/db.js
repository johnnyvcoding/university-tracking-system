const Sequelize = require("sequelize");
const pkg = require("../../package.json");
require("dotenv").config()
const databaseName =
  pkg.name + (process.env.NODE_ENV === "test" ? "-test" : "");
const databaseUsername = process.env.DB_USERNAME || "postgres";
const databasePassword = process.env.DB_PASSWORD || "password";



const db = new Sequelize(databaseName, databaseUsername, databasePassword, {
  host: "localhost",
  dialect: "postgres",
});


