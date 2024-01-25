const express = require("express");
const router = express.Router();
const catService = require("../services/jobCategoriesService");

router.get("/", async function (req, res, next) {
    try {
        res.json(await catService.getAll(req.query.page));
    } catch (err) {
        console.error(`Error while getting programming languages `, err.message);
        next(err);
    }
});

router.post("/", async function (req, res, next) {
    try {
        res.json(await catService.create(req.body.value));
    } catch (err) {
        console.error(`Error while getting programming languages `, err.message);
        next(err);
    }
});

router.post("/deactivate", async function (req, res, next) {
    try {
        res.json(await catService.deactivate(req.body.values));
    } catch (err) {
        console.error(`Error while deactivating the categories `, err.message);
        next(err);
    }
});

module.exports = router;
