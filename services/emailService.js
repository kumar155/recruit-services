const { transporter, mailOptions, htmlBodyContent } = require("../utils/email");

function sendNewEMail(userId) {
    const encodedId = Buffer.from(userId).toString('base64');
    const bodyContent = htmlBodyContent(encodedId);
    // Send the email
    transporter.sendMail({ ...mailOptions, html: bodyContent }, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
}

module.exports = {
    sendNewEMail
};