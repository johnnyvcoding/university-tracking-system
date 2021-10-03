const db = require("../db")
const Sequelize = require("sequelize")

const Student = require("./student")
const Professor = require("./professor")
const Course = require("./course")

module.exports = {
    Student,
    Professor,
    Course
}