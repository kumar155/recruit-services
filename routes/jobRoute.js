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

router.get("/categoriesall", async function (req, res, next) {
    try {
        res.json(await jobService.getAllCategories(req.query.page));
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

router.get("/locationsall", async function (req, res, next) {
    try {
        res.json(await jobService.getAllLocations(req.query.page));
    } catch (err) {
        console.error(`Error while getting programming languages `, err.message);
        next(err);
    }
});

router.get("/recentjobs/:page", async function (req, res, next) {
    try {
        res.json(await jobService.recentJobs(req.params.page));
    } catch (err) {
        console.error(`Error while getting programming languages `, err.message);
        next(err);
    }
});

router.post("/filters", async function (req, res, next) {
    try {
        const filters = Object.keys(req.body);
        if (filters.includes('category') && filters.includes('location')) {
            res.json(await jobService.getJobsByFilters(req.body));
        }
        else if (filters.includes('category')) {
            res.json(await jobService.getJobsByCategory(req.body));
        }
        else if (filters.includes('location')) {
            res.json(await jobService.getJobsByLocation(req.body));
        }
    } catch (err) {
        console.error(`Error while getting job details `, err.message);
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
