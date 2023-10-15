const express = require("express");
const router = express.Router();
const loginService = require("../services/loginService");

router.post("/", async function (req, res, next) {
    try {
        if (req.body.role !== 'recruiter') {
            res.json(await loginService.login(req.body));
        }
        else {
            res.json(await loginService.recruiterLogin(req.body));
        }
    } catch (err) {
        console.error(`Error user login to the system`, err.message);
        next(err);
    }
});

module.exports = router;
