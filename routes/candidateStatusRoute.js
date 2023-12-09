const express = require("express");
const router = express.Router();
const candidateService = require("../services/candidateStatusService");


router.get("/:userId/:jobId", async function (req, res, next) {
    try {
        res.json(await candidateService.getStatus(req.params, req.body));
    } catch (err) {
        console.error(`Error while getting programming languages `, err.message);
        next(err);
    }
});

router.get("/statusAuditHistory/:userId/:jobId", async function (req, res, next) {
    try {
        res.json(await candidateService.statusAuditHistory(req.params));
    } catch (err) {
        console.error(`Error while getting status audit history `, err.message);
        next(err);
    }
});

router.post("/", async function (req, res, next) {
    try {
        res.json(await candidateService.setStatus(req.body));
    } catch (err) {
        console.error(`Error in creating user profile`, err.message);
        next(err);
    }
});


module.exports = router;
