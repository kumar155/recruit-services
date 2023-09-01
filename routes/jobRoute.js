const express = require("express");
const router = express.Router();
const jobService = require("../services/jobService");

router.get("/categories", async function (req, res, next) {
    try {
        res.json(await jobService.jobsByCategory(req.query.page));
    } catch (err) {
        console.error(`Error while getting programming languages `, err.message);
        next(err);
    }
});

router.get("/locations", async function (req, res, next) {
    try {
        res.json(await jobService.jobsByLocation(req.query.page));
    } catch (err) {
        console.error(`Error while getting programming languages `, err.message);
        next(err);
    }
});

router.get("/recentjobs", async function (req, res, next) {
    try {
        res.json(await jobService.recentJobs(req.query.page));
    } catch (err) {
        console.error(`Error while getting programming languages `, err.message);
        next(err);
    }
});

router.get("/:id", async function (req, res, next) {
    try {
        res.json(await jobService.getJobDetails(req.params.id));
    } catch (err) {
        console.error(`Error while getting job details `, err.message);
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
