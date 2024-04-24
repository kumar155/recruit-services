function formattedDateTime() {
    const date = new Date();
    return date.toISOString().split('T')[0] + ' ' + date.toTimeString().split(' ')[0];
};

module.exports = formattedDateTime;