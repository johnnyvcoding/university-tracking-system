const router = require("express").Router();
const { StudentCourse, Student, Course } = require("../db/models");

router.get("/", async (req, res, next) => {
  try {
    let studentCourses = await StudentCourse.findAll();

    return res
      .set({ "x-organization": "Skyline" })
      .json(studentCourses)
      .status(200);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// this route removes student from course
router.delete("/:studentCourseId", async (req, res, next) => {
  try {
    let { studentCourseId } = req.params;

    let studentCourseRecord = await StudentCourse.findOne({
      where: { id: studentCourseId },
    });

    // if student record  exists, then return a message
    // else return a message
    return studentCourseRecord
      ? res
          .set({ "x-organization": "Skyline" })
          .json(studentCourseRecord)
          .status(202)
      : res
          .set({ "x-organization": "Skyline" })
          .json({ message: "Student record was not found" })
          .status(404);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// assigns a class (course) to a student
router.post("/", async (req, res, next) => {
  try {
    let { courseId, studentId } = req.body;

    let studentCourseRecord = await StudentCourse.create({
      courseId: courseId,
      studentId: studentId,
    });

    res
      .set({ "x-organization": "Skyline" })
      .json(studentCourseRecord)
      .status(201);
  } catch (error) {
    console.log(errr);
    next(error);
  }
});

module.exports = router;
