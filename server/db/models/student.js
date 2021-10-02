const Sequelize = require("sequelize");
const db = require("../db");

const Student = db.define("Student", {
  firstName: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  lastName: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  dateOfBirth: {
    type: Sequelize.DATEONLY,
    validate: {
      isDate: true,
    },
  },
  address: {
    type: Sequelize.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },

  enrollmentStatus: {
    type: Sequelize.ENUM("active", "graduated", "inactive"),
    allowNull: false,
    validate: {
      notEmpty: true,
    },
    default: "active",
  },
  enrollmentDate: {
    type: Sequelize.DATEONLY,
    validate: {
      isDate: true,
    },
  },
});

module.exports = Student;
