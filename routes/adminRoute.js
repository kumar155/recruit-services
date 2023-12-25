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
module.exports = router;
