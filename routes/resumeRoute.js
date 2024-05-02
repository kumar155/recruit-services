const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resume');

router.post('/upload/:id', resumeController.uploadFile);
router.get('/download/:id', resumeController.downloadResume);

module.exports = router;
