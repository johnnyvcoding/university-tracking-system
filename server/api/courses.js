const router = require("express").Router();
const { Course } = require("../db/models");

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

    return res.set({ "x-organization": "Skyline" }).json(courses).status(200);
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
        .set({ "x-organization": "Skyline" })
        .json({ message: "Course was not found" })
        .status(404);
    }

    return res.set({ "x-organization": "Skyline" }).json(course).status(200);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;
