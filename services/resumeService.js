const multer = require('multer');
// const logger = require('../config/logger-config');
const FileUploadValidationError = require('../exceptions/file-handling-exceptions');
const allowedFileTypes = require('../constants/constants');
// RESUME_FOLDER_PATH=user-resumes
const path = require('path');
const fs = require('fs');
const axios = require("axios");
var request = require("request");
const { insertResumeAnalysis } = require('../transactions/candidateJob.trans');


const pathAI = process.env.AI_PATH;

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

exports.uploadAndProcessIntelligence = async (req) => {
  try {
    const url = `${process.env.AI_PATH}/analyze_resume`;
    const formdata = new FormData();
    formdata.append('resume_file', req.file);
    formdata.append('job_description', 'Engineering Graduate');
    const filestream = fs.createReadStream(`./${req.file.path}`);
    var options = {
      method: 'POST',
      url,
      headers: { 'Content-Type': 'multipart/form-data' },
      formData: {
        resume_file: filestream,
        job_description: 'Engineering Graduate',
      },
      json: true,
    };

    let status = {};
    let MLresponse = {};

    await request(options, (error, response, body) => {
      if (error) throw new Error(error);
      // console.log(response);
      // console.log(body); //get your response here
      status.statusCode = response.statusCode;
      status.statusMessage = response.statusMessage;
      MLresponse = body;
      insertResumeAnalysis(req.body, MLresponse);
    });
    // console.log(result);
    // if (status.statusCode === 200) {
    //   insertResumeAnalysis(req, MLresponse);
    // }
    return { message: 'resume analysed and metrics generated successfully' };

  } catch (error) {
    console.log(error.message);
  }
};

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