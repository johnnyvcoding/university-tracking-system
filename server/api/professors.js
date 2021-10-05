const router = require("express").Router();
const { Professor, Course, Student } = require("../db/models");

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

  query.professorId ? (queryObj.professorId = query.professorId) : null;
  query.firstName ? (queryObj.firstName = query.firstName) : null;
  query.lastName ? (queryObj.lastName = query.lastName) : null;

  query.dateOfBirth ? (queryObj.dateOfBirth = query.dateOfBirth) : null;
  query.address ? (queryObj.address = query.address) : null;
  query.hireDate ? (queryObj.hireDate = query.hireDate) : null;
  query.email ? (queryObj.email = query.email) : null;

  return queryObj;
}

router.get("/", async (req, res, next) => {
  try {
    let professors = await Professor.findAll({
      where: returnQueryParamsObject(req.query),
    });

    return res
      .set({ "x-organization": "Skyline" })
      .json(professors)
      .status(200);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get("/:professorId", async (req, res, next) => {
  try {
    let { professorId } = req.params;
    let professor = await Professor.findOne({
      where: { professorId: professorId },
    });

    if (!professor) {
      return res
        .set({ "x-organization": "Skyline" })
        .json({ message: "Professor was not found" })
        .status(404);
    }

    return res.set({ "x-organization": "Skyline" }).json(professor).status(200);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get("/:professorId/courses", async (req, res, next) => {
  try {
    let { professorId } = req.params;
    let professorCourses = await Professor.findOne({
      where: { professorId: professorId },
      include: [
        // 'this' will return a single professor with its courses and the students
        // in the courses
        {
          model: Course,
          include: Student,
        },
      ],
    });

    if (!professorCourses) {
      return res
        .set({ "x-organization": "Skyline" })
        .json({ message: "Professor courses were not found" })
        .status(404);
    }

    return res
      .set({ "x-organization": "Skyline" })
      .json(professorCourses)
      .status(200);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

//create a professor
router.post("/", async (req, res, next) => {
  try {
    let { firstName, lastName, dateOfBirth, address, email, professorId } =
      req.body;

    let professor = await Professor.create({
      where: {
        firstName,
        lastName,
        dateOfBirth,
        address,
        hireDate,
        email,
      },
    });

    return res.set({ "x-organization": "Skyline" }).json(professor).status(201);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

//update a professor based on it
router.put("/:professorId", async (req, res, next) => {
  try {
    let { professorId } = req.params;
    let { firstName, lastName, dateOfBirth, address, email } = req.body;

    let professor = await Professor.findOne({
      where: {
        professorId: professorId,
      },
    });

    if (!professor) {
      return res
        .set({ "x-organization": "Skyline" })
        .json({ message: "Professor was not found" })
        .status(404);
    }

    firstName ? (professor.firstName = firstName) : null;
    lastName ? (professor.lastName = lastName) : null;

    dateOfBirth ? (professor.dateOfBirth = dateOfBirth) : null;
    address ? (professor.address = address) : null;
    hireDate ? (professor.hireDate = hireDate) : null;
    email ? (professor.email = email) : null;

    await professor.save();

    return res.set({ "x-organization": "Skyline" }).json(professor).status(202);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

//delete professor based on id
router.delete("/:professorId", async (req, res, next) => {
  try {
    let { professorId } = req.params;

    let professor = await Professor.findOne({
      where: {
        professorId: professorId,
      },
    });

    // destroy record if professor exists
    professor ? await professor.destroy() : null;

    // if professor exists, then return a message
    // else return a message
    return professor
      ? res.set({ "x-organization": "Skyline" }).json(professor).status(202)
      : res
          .set({ "x-organization": "Skyline" })
          .json({ message: "Professor was not found" })
          .status(404);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;
