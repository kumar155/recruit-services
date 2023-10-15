const express = require("express");
const router = express.Router();
const candidateService = require("../services/candidateService");

router.get("/", async function (req, res, next) {
  try {
    res.json(await candidateService.getAll(req.query.page));
  } catch (err) {
    console.error(`Error while getting programming languages `, err.message);
    next(err);
  }
});

router.get("/:id", async function (req, res, next) {
    try {
      res.json(await candidateService.getSelection(req.params.id, req.body));
    } catch (err) {
      console.error(`Error while getting programming languages `, err.message);
      next(err);
    }
});

/* POST programming language */
router.post("/", async function (req, res, next) {
  try {
    res.json(await candidateService.createStep1(req.body));
  } catch (err) {
    console.error(`Error in creating user profile`, err.message);
    next(err);
  }
});

router.post("/step2", async function (req, res, next) {
    try {
      res.json(await candidateService.createStep2(req.body));
    } catch (err) {
      console.error(`Error in building user profile`, err.message);
      next(err);
    }
});

router.post("/apply", async function (req, res, next) {
    try {
      res.json(await candidateService.apply(req.body));
    } catch (err) {
      console.error(`Error in building user profile`, err.message);
      next(err);
    }
});

/* PUT programming language */
router.put("/:id", async function (req, res, next) {
  try {
    res.json(await candidateService.update(req.params.id, req.body));
  } catch (err) {
    console.error(`Error while updating programming language`, err.message);
    next(err);
  }
});

/* DELETE programming language */
router.delete("/:id", async function (req, res, next) {
  try {
    res.json(await candidateService.remove(req.params.id));
  } catch (err) {
    console.error(`Error while deleting programming language`, err.message);
    next(err);
  }
});

router.get("/history/:id", async function (req, res, next) {
  try {
    res.json(await candidateService.getHistory(req.params.id));
  } catch (err) {
    console.error(`Error while getting candidate history `, err.message);
    next(err);
  }
});

router.get("/profile/:id", async function (req, res, next) {
  try {
    res.json(await candidateService.getProfile(req.params.id));
  } catch (err) {
    console.error(`Error while getting candidate profile `, err.message);
    next(err);
  }
});

router.get("/status/:id", async function (req, res, next) {
  try {
    res.json(await candidateService.checkIsAppliedJob(req, req.params.id));
  } catch (err) {
    console.error(`Error while getting candidate profile `, err.message);
    next(err);
  }
});


module.exports = router;
