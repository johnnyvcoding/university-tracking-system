const router = require("express").Router();
const { Course } = require("../db/models");

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

//delete course based on id
router.delete("/:couirseId", async (req, res, next) => {
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
    return student
      ? res.set({ "x-organization": "Skyline" }).json(course).status(202)
      : res
          .set({ "x-organization": "Skyline" })
          .json({ message: "Course was not found" })
          .status(404);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;
