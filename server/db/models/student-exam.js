const Sequelize = require("sequelize");
const db = require("../db");

const StudentExam = db.define("StudentExam", {
  studentExamId: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  studentPoints: {
    type: Sequelize.DECIMAL(10, 2),
    default: 0,
  },
  description: {
    type: Sequelize.TEXT,
  },
  completionDate: {
    type: Sequelize.DATEONLY,
    validate: {
      isDate: true,
    },
  },
  grade: {
      type: Sequelize.DECIMAL(10, 2)
  }
});

module.exports = StudentExam;
