const Sequelize = require("sequelize");
const db = require("../db");

const StudentCourse = db.define("StudentCourse", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  grade: {
    type: Sequelize.DECIMAL(10,2),
    default: 0
  }
});


module.exports = StudentCourse