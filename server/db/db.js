const Sequelize = require("sequelize");
const pkg = require("../../package.json");
require("dotenv").config();
const databaseName =
  pkg.name + (process.env.NODE_ENV === "test" ? "-test" : "");
const databaseUsername = process.env.DB_USERNAME || "postgres";
const databasePassword = process.env.DB_PASSWORD || "password";

let host;
let config = {};

// sets a local database if environment is in development
if (process.env.NODE_ENV === "development") {
  host = "localhost";
} else {
  // sets url to remote db along with its configuration
  host = process.env.DB_URL;
  (config.ssl = true), (config.operatorAliases = false);
  config.dialectOptions = {
    ssl: {
      require: true,
      rejectUnauthorized: true,
    },
  };
}

const db = new Sequelize(databaseName, databaseUsername, databasePassword, {
  host: host,
  dialect: "postgres",
  logging: false,
  ...config,
});

module.exports = db;
