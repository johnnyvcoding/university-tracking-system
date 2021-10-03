const Sequelize = require("sequelize");
const db = require("../db");

const Course = db.define("Course", {
  courseId: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
  },
  courseCode: {
    type: Sequelize.STRING,
  },
  description: {
    type: Sequelize.TEXT,
  },
  startDate: {
    type: Sequelize.DATEONLY,
    validate: {
      isDate: true,
    },
  },
  endDate: {
    type: Sequelize.DATEONLY,
    validate: {
      isDate: true,
    },
  },
  email: {
    type: Sequelize.TEXT,
    validate: {
      isEmail: true,
    },
  },
});

module.exports = Course;
