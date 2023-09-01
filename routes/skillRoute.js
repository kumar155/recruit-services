const express = require("express");
const router = express.Router();
const skillService = require("../services/skillService");

router.get("/", async function (req, res, next) {
  try {
    res.json(await skillService.getAll(req.query.page));
  } catch (err) {
    console.error(`Error while getting programming languages `, err.message);
    next(err);
  }
});

router.post("/", async function (req, res, next) {
    try {
      res.json(await skillService.create(req.body));
    } catch (err) {
      console.error(`Error while getting programming languages `, err.message);
      next(err);
    }
  });

module.exports = router;
