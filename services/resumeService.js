const multer = require('multer');
// const logger = require('../config/logger-config');
const FileUploadValidationError = require('../exceptions/file-handling-exceptions');
const allowedFileTypes = require('../constants/constants');
// RESUME_FOLDER_PATH=user-resumes
const path = require('path');
const fs = require('fs');

// Multer Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.RESUME_FOLDER_PATH);
  },
  filename: (req, file, cb) => {
    // logger.info(
    //   'Uploading file: %s, filetype: %s',
    //   file.originalname,
    //   file.mimetype
    // );
    const extension = allowedFileTypes[file.mimetype];
    const newName = `${req.params.id}${extension}`;
    cb(null, newName);
  }
});

exports.upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (!Object.keys(allowedFileTypes).includes(file.mimetype)) {
      return cb(new FileUploadValidationError('File type is not allowed'));
    }
    cb(null, true);
  }
});


exports.downloadFile = async (filename) => {
  const filePath = path.join(process.env.RESUME_FOLDER_PATH, filename);
  return new Promise((resolve, reject) => {
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        reject(err);
        return;
      }
      const fileStream = fs.createReadStream(filePath);
      resolve(fileStream);
    });
  });
};