const router = require("express").Router();
const { User, Apikey } = require("../db/models");

router.delete("/:userId/api-key", async (req, res, next) => {
  try {
    let { userId } = req.params;
    let key = await Apikey.findOne({ where: { UserId: userId } });

    if (!key) {
      res
        .set({
          "x-organization": "Skyline",
          "Content-Type": "application/json",
        })
        .json({ message: "USER DOES NOT HAVE A KEY" })
        .status(404);
    }

    await key.destroy();

    return res
      .set({
        "x-organization": "Skyline",
        "Content-Type": "application/json",
      })
      .json({ message: "Key was deleted!" })
      .status(202);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;
