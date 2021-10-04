const router = require("express").Router();
const { Student } = require("../db/models");

function studentQuerySearch() {}

// get students based on their first and last name
router.get("/", async (req, res, next) => {
  try {
    let { firstName, lastName } = req.query;

    let students = await Student.findAll({
      where: {
        firstName: firstName,
        lastName: lastName,
      },
    });

    return res.set({ "x-organization": "Skyline" }).json(students).status(200);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// get a single student based on its id
router.get("/:studentId", async (req, res, next) => {
  try {
    let { studentId } = req.params;

    let student = await Student.findOne({
      where: {
        studentId: studentId,
      },
    });

    // if student exists, then return a message
    // else return a message
    return student
      ? res.set({ "x-organization": "Skyline" }).json(student).status(200)
      : res
          .set({ "x-organization": "Skyline" })
          .json({ message: "Student was not found" }).status(404);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.delete("/:studentId", async (req, res, next) => {
  try {
    let { studentId } = req.params;

    let student = await Student.findOne({
      where: {
        studentId: studentId,
      },
    });

    // destroy record if a student exists
    student ? await student.destroy() : null;

    // if student exists, then return a message
    // else return a message
    return student
      ? res.set({ "x-organization": "Skyline" }).json(student).status(202)
      : res
          .set({ "x-organization": "Skyline" })
          .json({ message: "Student was not found" }).status(404);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;
