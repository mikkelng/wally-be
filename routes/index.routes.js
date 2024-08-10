const express = require("express")
const router = express.Router()

router.get("/index", (req, res, next) => {
  res.json("All good in here");
});

module.exports = router;