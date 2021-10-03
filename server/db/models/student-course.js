const Sequelize = require("sequelize");
const db = require("../db");

const StudentCourse = db.define("StudentCourse", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
});


module.exports = StudentCourse