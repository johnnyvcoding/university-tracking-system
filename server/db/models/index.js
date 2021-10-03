const db = require("../db");
const Sequelize = require("sequelize");

const Student = require("./student");
const Professor = require("./professor");
const Course = require("./course");
const User = require("./user");

// 1 to many relationship
Professor.hasMany(Course, {
  foreignKey: {
    name: "professorId",
  },
});
Course.belongsTo(Professor, {
  foreignKey: {
    name: "professorId",
  },
});

module.exports = {
  Student,
  Professor,
  Course,
  User,
};
