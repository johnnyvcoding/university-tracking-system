const router = require("express").Router();
const { Apikey, User } = require("../db/models");
const crypto = require("crypto");

// const algorithm = "RSA-SHA256"
// const securityKey = crypto.randomBytes(16).toString("base64")
// const vectorKey = crypto.randomBytes(16)
// const decipher = crypto.createDecipheriv(algorithm, securityKey, vectorKey)

function generateKey() {
  //creates a base 36 string character
  // letters can range from a-z
  // nummbers 0-9
  return [...Array(30)]
    .map((e) => ((Math.random() * 36) | 0).toString(36))
    .join("");
}

// in order for these routes to be accessed,
// a user must be originally seeded manually
router.post("/", async (req, res, next) => {
  try {
    let { userId } = req.body;

    if (!userId) {
      return res
        .set({ "x-organization": "Skyline" })
        .json({ message: "No user was selected" })
        .status(400);
    }

    let generatedKey = generateKey();

    // passing the user id will assign a new key
    let key = await Apikey.create({
      key: generatedKey,
      UserId: userId,
    });

    return res
      .set({ "x-organization": "Skyline", "Content-Type": "application/json" })
      .json({ api_key: generatedKey })
      .status(201);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;
