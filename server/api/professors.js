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
      .status(200)
      .set({ "x-organization": "Skyline", "Content-Type": "application/json" })
      .json(professors)
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
        .status(404)
        .set({ "x-organization": "Skyline", "Content-Type": "application/json" })
        .json({ message: "Professor was not found" })
    }

    return res.set({ "x-organization": "Skyline", "Content-Type": "application/json" }).json(professor).status(200);
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
        .status(404)
        .set({ "x-organization": "Skyline", "Content-Type": "application/json" })
        .json({ message: "Professor courses were not found" })
    }

    return res
      .status(200)
      .set({ "x-organization": "Skyline", "Content-Type": "application/json" })
      .json(professorCourses)
  } catch (error) {
    console.log(error);
    next(error);
  }
});

//create a professor
router.post("/", async (req, res, next) => {
  try {
    let { firstName, lastName, dateOfBirth, address, email, hireDate } =
      req.body;


    let professor = await Professor.create({
        firstName,
        lastName,
        dateOfBirth,
        address,
        hireDate,
        email,
      
    });

    return res.status(201).set({ "x-organization": "Skyline", "Content-Type": "application/json" }).json(professor)
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
        .status(404)
        .set({ "x-organization": "Skyline", "Content-Type": "application/json" })
        .json({ message: "Professor was not found" })
    }

    firstName ? (professor.firstName = firstName) : null;
    lastName ? (professor.lastName = lastName) : null;

    dateOfBirth ? (professor.dateOfBirth = dateOfBirth) : null;
    address ? (professor.address = address) : null;
    hireDate ? (professor.hireDate = hireDate) : null;
    email ? (professor.email = email) : null;

    await professor.save();

    return res.status(202).set({ "x-organization": "Skyline", "Content-Type": "application/json" }).json(professor)
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
      ? res.status(202).set({ "x-organization": "Skyline", "Content-Type": "application/json" }).json(professor)
      : res
          .status(404)
          .set({ "x-organization": "Skyline", "Content-Type": "application/json" })
          .json({ message: "Professor was not found" })
          
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;
