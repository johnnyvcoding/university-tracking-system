const router = require("express").Router();
const { Student } = require("../db/models");

router.get("/", async (req, res, next) => {
  try {
    let { firstName, lastName } = req.query;

    let student = await Student.findOne({
      where: {
        firstName: firstName,
        lastName: lastName,
      },
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;
