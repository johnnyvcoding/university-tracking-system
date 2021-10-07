const { Apikey, User } = require("../db/models");

async function verifyKey(req, res, next) {
  try {
    let key = req.headers["x-api-key"];

    //plan to change this once we create a client view
    // user must be logged in order to proceed
    let userId = req.body.userId;

    if (!key) {
     return res
        .status(401)
        .set({ "x-organization": "Skyline" })
        .json({ message: "Api key was not found" });
    }

    if (!userId) {
      return res
        .status(401)
        .set({ "x-organization": "Skyline" })
        .json({ message: "Please log in to be able to user our api service!" })
        
    }

    let userKey = await Apikey.findOne({
      where: {
        UserId: userId,
      },
    });

    if (!userKey) {
      return res
        .status(403)
        .set({ "x-organization": "Skyline" })
        .json({ message: "User does not have access!" })
    }

    if (!userKey.correctKey(key)) {
      return res
        .status(401)
        .set({ "x-organization": "Skyline" })
        .json({ message: "Incorrect key!" })
        ;
    }

    next();
  } catch (error) {
    console.log(error);
  }
}

module.exports = verifyKey;
