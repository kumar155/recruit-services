const express = require("express");
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Set the destination and filename for uploaded files
const storage = multer.diskStorage({
    destination: '../uploads/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
});

// Initialize multer with the storage configuration
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        cb(undefined, true);
    }
});

// Define a route to handle file uploads
router.post('/upload', upload.array('files'), (req, res) => {
    res.send(req.file);
    // 'file' is the name attribute from the FilePond component
    // Access the uploaded file information through req.file
    // if (!req.file) {
    //     return res.status(400).send('No files were uploaded.');
    // }

    // // You can perform further operations with the uploaded file here
    // // For example, you might save the file information to a database

    // res.status(200).send('File uploaded successfully.');
}, (err, req, res, next) => {
    res.status(400).send({ error: err.message });
});

module.exports = router;