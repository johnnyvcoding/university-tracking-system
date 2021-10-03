const db = require("../db");
const Sequelize = require("sequelize");

const Student = require("./student");
const Professor = require("./professor");
const Course = require("./course");
const User = require("./user");
const StudentCourse = require("./student-course");
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

// many to many relationship 
Course.belongsToMany(Student, {
  through: StudentCourse,
  foreignKey: {
    name: "courseId",
  },
});
Student.belongsToMany(Course, {
  through: StudentCourse,
  foreignKey: {
    name: "studentId",
  },
});

module.exports = {
  Student,
  Professor,
  Course,
  User,
  StudentCourse
};
