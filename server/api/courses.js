const router = require("express").Router();
const { Course, Student } = require("../db/models");
const Exam = require("../db/models/exam");
const { assignStudentsExam } = require("./helper-functions");
// this function will return all the query strings that were present
// this makes dynamic searching much easier in case we dont have
// all the paramaters
/* 
example /?firstName=John 
    the func will only return an object with the following:
    {
        firstName: "John"
    }
*/
function returnQueryParamsObject(query) {
  let queryObj = {};

  if (!query) return queryObj;

  query.courseId ? (queryObj.courseId = query.courseId) : null;
  query.name ? (queryObj.name = query.name) : null;
  query.courseCode ? (queryObj.courseCode = query.courseCode) : null;
  query.startDate ? (queryObj.startDate = query.startDate) : null;
  query.endDate ? (queryObj.endDate = query.endDate) : null;
  query.professorId ? (queryObj.professorId = query.professorId) : null;

  return queryObj;
}

router.get("/", async (req, res, next) => {
  try {
    let courses = await Course.findAll({
      where: returnQueryParamsObject(req.query),
    });

    return res
      .status(200)
      .set({ "x-organization": "Skyline", "Content-Type": "application/json" })
      .json(courses)
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get("/:courseId", async (req, res, next) => {
  try {
    let { courseId } = req.params;
    let course = await Course.findOne({ where: { courseId: courseId } });

    if (!course) {
      return res
        .status(404)
        .set({ "x-organization": "Skyline" })
        .json({ message: "Course was not found" })
    }

    return res
      .status(200)
      .set({ "x-organization": "Skyline", "Content-Type": "application/json" })
      .json(course)
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get("/:courseId/exams", async (req, res, next) => {
  try {
    let { courseId } = req.params;
    let course = await Course.findOne({
      where: { courseId: courseId },
      include: [Exam],
    });

    if (!course) {
      return res
        .status(404)
        .set({
          "x-organization": "Skyline",
          "Content-Type": "application/json",
        })
        .json({ message: "Course was not found" })
    }

    return res
      .status(200)
      .set({ "x-organization": "Skyline", "Content-Type": "application/json" })
      .json(course)
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get("/:courseId/student-exams", async (req, res, next) => {
  try {
    let { courseId } = req.params;

    // will join table where records match for students and exams
    // in summary: this will return the students along with the exam sccores for the class
    let course = await Course.findOne({
      where: { courseId: courseId },
      include: [
        {
          model: Student,
          include: [
            {
              model: Exam,
              where: {
                courseId: courseId,
              },
            },
          ],
        },
      ],
    });

    if (!course) {
      return res
        .status(404)
        .set({
          "x-organization": "Skyline",
          "Content-Type": "application/json",
        })
        .json({ message: "Course was not found" })
    }

    return res
      .status(200)
      .set({ "x-organization": "Skyline", "Content-Type": "application/json" })
      .json(course)
  } catch (error) {
    console.log(error);
    next(error);
  }
});

//create a course
router.post("/", async (req, res, next) => {
  try {
    let { name, courseCode, description, startDate, endDate, professorId } =
      req.body;

    let course = await Course.create({
      name,
      courseCode,
      description,
      startDate,
      endDate,
      professorId,
    });

    return res
      .status(201)
      .set({ "x-organization": "Skyline", "Content-Type": "application/json" })
      .json(course)
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.post("/:courseId/add-student", async (req, res, next) => {
  try {
    let { studentId } = req.body;

    let { courseId } = req.params;
    let course = await Course.findOne({ where: { courseId: courseId } });

    if (!course) {
      return res
        .set({
          "x-organization": "Skyline",
          "Content-Type": "application/json",
        })
        .json({ message: "Course was not found" })
        .status(404);
    }

    // verifies that an Id number is passed
    if (isNaN(studentId))
      return res
        .status(400)
        .set({
          "x-organization": "Skyline",
          "Content-Type": "application/json",
        })
        .json({ message: "Invald Student" })

    // this is a sequelize "magic" method
    await course.addStudent([studentId]);

    return res
      .status(201)
      .set({ "x-organization": "Skyline", "Content-Type": "application/json" })
      .json(course)
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// add an exam to given course
router.post("/:courseId/add-exam", async (req, res, next) => {
  try {
    let { name, points, description, assignedDate, deadlineDate } = req.body;
    let { courseId } = req.params;

    if (!courseId) {
      return res
        .status(404)
        .set({
          "x-organization": "Skyline",
          "Content-Type": "application/json",
        })
        .json({ message: "Course was not found" })
    }

    let exam = await Exam.create({
      name,
      points,
      assignedDate,
      deadlineDate,
      courseId,
    });

    // assign exam to all the students in the course
    await assignStudentsExam(courseId, exam);

    return res
      .status(201)
      .set({ "x-organization": "Skyline", "Content-Type": "application/json" })
      .json(exam)
  } catch (error) {
    console.log(error);
    next(error);
  }
});

//update course based on it
router.put("/:courseId", async (req, res, next) => {
  try {
    let { courseId } = req.params;
    let { name, courseCode, description, startDate, endDate, professorId } =
      req.body;

    let course = await Course.findOne({
      where: {
        courseId: courseId,
      },
    });

    if (!course) {
      return res
        .status(404)
        .set({
          "x-organization": "Skyline",
          "Content-Type": "application/json",
        })
        .json({ message: "Course was not found" })
    }

    name ? (course.name = name) : null;
    courseCode ? (course.courseCode = courseCode) : null;
    description ? (course.description = description) : null;
    startDate ? (course.startDate = startDate) : null;
    endDate ? (course.endDate = endDate) : null;
    professorId ? (course.professorId = professorId) : null;

    await course.save();

    return res
      .status(202)
      .set({ "x-organization": "Skyline", "Content-Type": "application/json" })
      .json(course)
      
  } catch (error) {
    console.log(error);
    next(error);
  }
});

//delete course based on id
router.delete("/:courseId", async (req, res, next) => {
  try {
    let { courseId } = req.params;

    let course = await Course.findOne({
      where: {
        courseId: courseId,
      },
    });

    // destroy record if course exists
    course ? await course.destroy() : null;

    // if course exists, then return a message
    // else return a message
    return course
      ? res
          .status(202)
          .set({
            "x-organization": "Skyline",
            "Content-Type": "application/json",
          })
          .json(course)
      : res
        .status(404)
          .set({
            "x-organization": "Skyline",
            "Content-Type": "application/json",
          })
          .json({ message: "Course was not found" })
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;
