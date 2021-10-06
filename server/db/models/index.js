const db = require("../db");
const Sequelize = require("sequelize");

const Student = require("./student");
const Professor = require("./professor");
const Course = require("./course");
const User = require("./user");
const StudentCourse = require("./student-course");
const Exam = require("./exam");
const StudentExam = require("./student-exam")

const Apikey = require("./api-keys");
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

// one to many relationship
Exam.belongsTo(Course, {
  foreignKey: {
    name: "courseId",
  },
});
Course.hasMany(Exam, {
  foreignKey: {
    name: "courseId",
  },
});


// many to many relationship
Student.belongsToMany(Exam, {
  through: StudentExam,
  foreignKey: {
    name: "studentId"
  }
})
Exam.belongsToMany(Student, {
  through: StudentExam,
  foreignKey: {
    name: "examId"
  }
})


Course.hasMany(StudentExam, {
  foreignKey: {
    name: "courseId"
  }
})

StudentExam.belongsTo(Course, {
  foreignKey: {
    name: "courseId"
  }
})

// one to one relationship
// helps with track of who owns the key
User.hasOne(Apikey);
Apikey.belongsTo(User);

module.exports = {
  Student,
  Professor,
  Course,
  User,
  StudentCourse,
  Apikey,
  StudentExam
};
