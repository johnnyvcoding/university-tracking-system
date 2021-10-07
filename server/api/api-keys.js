const router = require("express").Router();
const { Apikey, User } = require("../db/models");


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
        .status(400)
        .set({ "x-organization": "Skyline" })
        .json({ message: "No user was selected" })
    }

    let generatedKey = generateKey();

    // passing the user id will assign a new key
    let key = await Apikey.create({
      key: generatedKey,
      UserId: userId,
    });

    return res
      .status(201)
      .set({ "x-organization": "Skyline", "Content-Type": "application/json" })
      .json({ api_key: generatedKey })
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;
