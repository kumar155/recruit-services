const express = require("express");
const router = express.Router();
const candidateJobService = require("../services/candidateJobService");

router.post("/", async function (req, res, next) {
    try {
        res.json(await candidateJobService.apply(req, req.body));
    } catch (err) {
        console.error(`Error in applying to job`, err.message);
        next(err);
    }
});

module.exports = router;
