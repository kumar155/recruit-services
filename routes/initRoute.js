const express = require("express");
const router = express.Router();
const initService = require("../services/initService");

router.get("/statustypes", async function (req, res, next) {
  try {
    res.json(await initService.getStatusTypes(req.query.page));
  } catch (err) {
    console.error(`Error while getting status types`, err.message);
    next(err);
  }
});

router.post("/", async function (req, res, next) {
    try {
      res.json(await initService.create(req.body));
    } catch (err) {
      console.error(`Error while getting programming languages `, err.message);
      next(err);
    }
  });

module.exports = router;
