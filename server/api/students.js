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
        lastName:  lastName 
      },
    });

    return res
      .set({ "x-organization": "Skyline" })
      .json(students)
      .status(200);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;
