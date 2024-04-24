// const logger = require('../config/logger-config');
const resumeService = require('../services/resumeService').upload.single(
  'file'
);
const FileUploadValidationError = require('../exceptions/file-handling-exceptions');

exports.uploadFile = async (req, res) => {
  resumeService(req, res, function (error) {
    if (error instanceof FileUploadValidationError) {
    //   logger.error(error, 'Upload failed, invalid input. %s', error.message);
      return res
        .status(400)
        .json({ error: 'Upload failed, invalid input. ' + error.message });
    } else if (error) {
    //   logger.error(error, 'Internal server error:. %s', error.message);
      return res
        .status(500)
        .json({ error: 'Internal server error: ' + error.message });
    }
    if (!req.file) {
    //   logger.error('File key is invalid or missing');
      return res.status(400).json({ error: 'File key is invalid or missing' });
    }
    // logger.info('File uploaded successfully: %s', req.file.filename);
    res.status(200).json({
      message: 'File uploaded successfully',
      filename: req.file.filename
    });
  });
};
