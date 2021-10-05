const { Apikey, User } = require("../db/models");

async function verifyKey(req, res, next) {
  try {
    let key = req.headers["x-api-key"];

    //plan to change this once we create a client view
    // user must be logged in order to proceed
    let userId = req.body.userId;

    if (!key) {
      res
        .set({ "x-organization": "Skyline" })
        .json({ message: "Api key was not found" })
        .status(401);
    }

    if (!userId) {
      res
        .set({ "x-organization": "Skyline" })
        .json({ message: "Please log in to be able to user our api service!" })
        .status(401);
    }

    let userKey = await Apikey.findOne({
      where: {
        UserId: userId,
      },
    });

    if (!userKey) {
      return res
        .set({ "x-organization": "Skyline" })
        .json({ message: "User does not have access!" })
        .status(403);
    }

    if (!userKey.correctKey(key)) {
      return res
        .set({ "x-organization": "Skyline" })
        .json({ message: "Incorrect key!" })
        .status(401);
    }

    next();
  } catch (error) {
    console.log(error);
  }
}

module.exports = verifyKey;
