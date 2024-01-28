const express = require("express");
const router = express.Router();
const vendorService = require("../services/vendorService");

router.get("/history/:id", async function (req, res, next) {
  try {
    res.json(await vendorService.getAll(req.params.id));
  } catch (err) {
    console.error(`Error while getting programming languages `, err.message);
    next(err);
  }
});

router.get("/appliedhistory/:id", async function (req, res, next) {
  try {
    res.json(await vendorService.getAppliedCandidates(req.params.id, req.query?.type));
  } catch (err) {
    console.error(`Error while getting programming languages `, err.message);
    next(err);
  } 
});

router.get("/active/:id", async function (req, res, next) {
  try {
    res.json(await vendorService.makeActive(req.params.id));
  } catch (err) {
    console.error(`Error while updating the job status `, err.message);
    next(err);
  }
});

router.get("/deactive/:id", async function (req, res, next) {
  try {
    res.json(await vendorService.makeInactive(req.params.id));
  } catch (err) {
    console.error(`Error while updating the job status `, err.message);
    next(err);
  }
});

router.get("/:id", async function (req, res, next) {
    console.log(req);
    try {
      res.json(await vendorService.getSelection(req.params.id, req.body));
    } catch (err) {
      console.error(`Error while getting programming languages `, err.message);
      next(err);
    }
});

/* POST programming language */
router.post("/", async function (req, res, next) {
  try {
    res.json(await vendorService.createStep1(req.body));
  } catch (err) {
    console.error(`Error in creating a job position`, err.message);
    next(err);
  }
});

router.post("/description", async function (req, res, next) {
    try {
      res.json(await vendorService.createStep2(req.body));
    } catch (err) {
      console.error(`Error in posting job description`, err.message);
      next(err);
    }
});

router.post("/publish", async function (req, res, next) {
    try {
      res.json(await vendorService.publish(req.body));
    } catch (err) {
      console.error(`Error in publishing job position`, err.message);
      next(err);
    }
});

/* PUT programming language */
router.put("/:id", async function (req, res, next) {
  try {
    res.json(await vendorService.update(req.params.id, req.body));
  } catch (err) {
    console.error(`Error while updating programming language`, err.message);
    next(err);
  }
});

/* DELETE programming language */
router.delete("/:id", async function (req, res, next) {
  try {
    res.json(await vendorService.remove(req.params.id));
  } catch (err) {
    console.error(`Error while deleting programming language`, err.message);
    next(err);
  }
});

router.get("/statushistory/:vendorid", async function (req, res, next) {
  try {
    res.json(await vendorService.getStatusTypeHistory(req.params.vendorid, req.query.status));
  } catch (err) {
    console.error(`Error while getting programming languages `, err.message);
    next(err);
  }
});

module.exports = router;
