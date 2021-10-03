const router = require("express").Router();
const { Student } = require("../db/models");

router.get("/", async (req, res, next) => {
  try {
    let students = await Student.findAll({});

    return res.json(students);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    let { firstName, lastName } = req.query;

    let students = await Student.findAll({
      where: {
        firstName: firstName,
        lastName: lastName,
      },
    });

    return res.json(students);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;
