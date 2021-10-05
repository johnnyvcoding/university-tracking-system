const Sequelize = require("sequelize");
const db = require("../db");

const Exam = db.define("Exam", {
  examId: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
  },
  points: {
    type: Sequelize.INTEGER,
    default: 0,
  },
  description: {
    type: Sequelize.TEXT,
  },
  assignedDate: {
    type: Sequelize.DATEONLY,
    validate: {
      isDate: true,
    },
  },
  deadlineDate: {
    type: Sequelize.DATEONLY,
    validate: {
      isDate: true,
    },
  },
});

module.exports = Exam;
