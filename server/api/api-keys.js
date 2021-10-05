const router = require("express").Router();
const { Apikey, User } = require("../db/models");
const crypto = require("crypto");

// const algorithm = "RSA-SHA256"
// const securityKey = crypto.randomBytes(16).toString("base64")
// const vectorKey = crypto.randomBytes(16)
// const decipher = crypto.createDecipheriv(algorithm, securityKey, vectorKey)

router.get("/", async (req, res, next) => {
  try {
    let { apiKey } = req.query;

    let userOne = await Apikey.findOne({
        where: {
            UserId: 1
        }
    })

    if (userOne.correctKey(apiKey)) {
        return res.json({message: "Correct"})
    }


    return res.json(userOne);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;
