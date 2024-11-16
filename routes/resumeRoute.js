const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resume');

router.post('/upload/:id', resumeController.uploadFile);
router.get('/download/:id', resumeController.downloadResume);
router.post('/processintelligence/:fileName', resumeController.processOnlyIntelligence);

module.exports = router;
