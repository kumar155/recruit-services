const allowedFileTypes = require("../constants/constants");

function getFileExtension(mimeType) {
    return allowedFileTypes[mimeType];
};

module.exports = getFileExtension;