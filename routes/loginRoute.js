const express = require("express");
const router = express.Router();
const loginService = require("../services/loginService");

router.post("/", async function (req, res, next) {
  try {
    res.json(await loginService.login(req.body));
  } catch (err) {
    console.error(`Error user login to the system`, err.message);
    next(err);
  }
});

module.exports = router;
