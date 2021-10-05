const router = require("express").Router();
const { Student, Course, Professor } = require("../db/models");
const Exam = require("../db/models/exam");
const StudentExam = require("../db/models/student-exam");

function returnSearchQueryObject(query) {
  let queryObj = {};

  query.firstName ? (queryObj.firstName = query.firstName) : null;
  query.lastName ? (queryObj.lastName = query.lastName) : null;
  query.dateOfBirth ? (queryObj.dateOfBirth = query.dateOfBirth) : null;
  query.address ? (queryObj.address = query.address) : null;
  query.enrollmentStatus
    ? (queryObj.enrollmentStatus = query.enrollmentStatus)
    : null;
  query.enrollmentDate
    ? (queryObj.enrollmentDate = query.enrollmentDate)
    : null;

  return queryObj;
}

// get students based on their first and last name
router.get("/", async (req, res, next) => {
  try {
    let students = await Student.findAll({
      where: returnSearchQueryObject(req.query),
    });

    return res
      .set({ "x-organization": "Skyline", "Content-Type": "application/json" })
      .json(students)
      .status(200);
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
      ? res
          .set({
            "x-organization": "Skyline",
            "Content-Type": "application/json",
          })
          .json(student)
          .status(200)
      : res
          .set({
            "x-organization": "Skyline",
            "Content-Type": "application/json",
          })
          .json({ message: "Student was not found" })
          .status(404);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// get a single student classes based on its id
router.get("/:studentId/courses", async (req, res, next) => {
  try {
    let { studentId } = req.params;

    let studentCourses = await Student.findOne({
      where: {
        studentId: studentId,
      },
      include: [
        // will bring all courses that belong to 'this' user
        // and will join table with professors
        {
          model: Course,
          include: Professor,
        },
      ],
    });

    // if student exists, then return a message
    // else return a message
    return studentCourses
      ? res
          .set({
            "x-organization": "Skyline",
            "Content-Type": "application/json",
          })
          .json(studentCourses)
          .status(200)
      : res
          .set({
            "x-organization": "Skyline",
            "Content-Type": "application/json",
          })
          .json({ message: "Student's courses were not found" })
          .status(404);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// get a single student course grades based on its id
router.get("/:studentId/course-grades", async (req, res, next) => {
  try {
    let { studentId } = req.params;

    let studentCourses = await Student.findOne({
      where: {
        studentId: studentId,
      },
      include: [
        // will bring all courses that belong to 'this' user
        // and will join table with professors
        {
          model: Course,
          include: [
            {
              model: Exam,
              include: [
                {
                  model: Student,
                  where: {
                    studentId: studentId,
                  },
                },
              ],
            },
          ],
        },
      ],
    });

    // if student exists, then return a message
    // else return a message
    return studentCourses
      ? res
          .set({
            "x-organization": "Skyline",
            "Content-Type": "application/json",
          })
          .json(studentCourses)
          .status(200)
      : res
          .set({
            "x-organization": "Skyline",
            "Content-Type": "application/json",
          })
          .json({ message: "Student's courses were not found" })
          .status(404);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

//delete student based on id
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
      ? res
          .set({
            "x-organization": "Skyline",
            "Content-Type": "application/json",
          })
          .json(student)
          .status(202)
      : res
          .set({ "x-organization": "Skyline" })
          .json({ message: "Student was not found" })
          .status(404);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

//update a student's data
router.put("/:studentId", async (req, res, next) => {
  try {
    let { studentId } = req.params;
    let {
      firstName,
      lastName,
      dateOfBirth,
      address,
      enrollmentStatus,
      enrollmentDate,
    } = req.body;

    let student = await Student.findOne({
      where: {
        studentId: studentId,
      },
    });

    if (!student)
      return res
        .set({
          "x-organization": "Skyline",
          "Content-Type": "application/json",
        })
        .json({ message: "Student was not found" })
        .status(404);

    // update student's field if properties exists
    firstName ? (student.firstName = firstName) : null;
    lastName ? (student.lastName = lastName) : null;
    dateOfBirth ? (student.dateOfBirth = dateOfBirth) : null;
    address ? (student.address = address) : null;
    enrollmentStatus ? (student.enrollmentStatus = enrollmentStatus) : null;
    enrollmentDate ? (student.enrollmentDate = enrollmentDate) : null;

    await student.save();

    return res
      .set({ "x-organization": "Skyline", "Content-Type": "application/json" })
      .json(student)
      .status(202);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    let {
      firstName,
      lastName,
      dateOfBirth,
      address,
      enrollmentStatus,
      enrollmentDate,
    } = req.body;

    let student = await Student.create({
      firstName: firstName,
      lastName: lastName,
      dateOfBirth: dateOfBirth,
      address: address,
      enrollmentDate: enrollmentDate,
      enrollmentStatus: enrollmentStatus,
    });

    return res
      .set({ "x-organization": "Skyline", "Content-Type": "application/json" })
      .json(student)
      .status(201);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.post("/:studentId/add-course", async (req, res, next) => {
  try {
    let { courseId } = req.body;

    let { studentId } = req.params;
    let student = await Student.findOne({ where: { studentId: studentId } });

    // verifies that an Id number is passed
    if (isNaN(courseId))
      return res
        .set({
          "x-organization": "Skyline",
          "Content-Type": "application/json",
        })
        .json({ message: "Invald Course" })
        .status(400);

    await student.addCourse([courseId]);

    if (!student) {
      return res
        .set({
          "x-organization": "Skyline",
          "Content-Type": "application/json",
        })
        .json({ message: "Student was not found" })
        .status(404);
    }

    return res
      .set({ "x-organization": "Skyline", "Content-Type": "application/json" })
      .json(student)
      .status(201);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;
