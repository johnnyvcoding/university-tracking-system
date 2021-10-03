const Sequelize = require("sequelize");
const db = require("../db");

const Professor = db.define("Professor", {
  professorId: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

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
  hireDate: {
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

module.exports = Professor;
