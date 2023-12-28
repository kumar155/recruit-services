const express = require("express");
const router = express.Router();
const adminService = require("../services/adminService");

router.get("/getTypes/:id", async function (req, res, next) {
    try {
        res.json(await adminService.getTypes(req.params.id));
    } catch (err) {
        console.error(`Error while retrieving types`, err.message);
        next(err);
    }
});

router.get("/getLocationStats/:id", async function (req, res, next) {
    try {
        res.json(await adminService.getLocationStats(req.params.id));
    } catch (err) {
        console.error(`Error while retrieving locations data`, err.message);
        next(err);
    }
});

router.get("/getRecentJobs/:id", async function (req, res, next) {
    try {
        res.json(await adminService.getRecentJobs(req.params.id));
    } catch (err) {
        console.error(`Error while retrieving recent jobs data`, err.message);
        next(err);
    }
});

router.get("/getCategories/:id", async function (req, res, next) {
    try {
        res.json(await adminService.getCategories(req.params.id));
    } catch (err) {
        console.error(`Error while retrieving categories data`, err.message);
        next(err);
    }
});
module.exports = router;
