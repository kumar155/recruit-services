// const logger = require('../config/logger-config');
const resumeService = require('../services/resumeService');

const uploadNewFile = resumeService.upload.single(
  'file'
);
const FileUploadValidationError = require('../exceptions/file-handling-exceptions');

exports.uploadFile = async (req, res) => {
  try {
    uploadNewFile(req, res, function (error) {
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
      res.status(200).json({
        message: 'File uploaded successfully',
        filename: req.file.filename
      });
      // logger.info('File uploaded successfully: %s', req.file.filename);
      return resumeService.uploadAndProcessIntelligence(req);
    });
  } catch (error) {
    console.log(error);
  }
};

exports.downloadResume = async (req, res) => {
  const filename = req.query.filename;
  if (!filename) {
    res.status(400).send('Invalid filename');
    return;
  }

  try {
    const fileStream = await resumeService.downloadFile(filename);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/octet-stream');
    fileStream.pipe(res);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // logger.error(error, 'File is not found: %s', filename);
      res.status(404).json({
        message: 'File not found',
        filename: filename
      });
    } else {
      // logger.error(error, 'An unexpected error occurred: %s', error.message);
      res.status(500).json({
        message: 'Internal Server Error',
        filename: filename
      });
    }
  }
};
