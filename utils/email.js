const nodemailer = require('nodemailer');
require('dotenv').config();

// Create a transporter
const transporter = nodemailer.createTransport({
    // service: 'gmail', // Use Gmail, or change to your email service
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Define the email options
const mailOptions = {
    from: process.env.EMAIL_USER, // Sender address
    to: process.env.EMAIL_USER, // Recipient's address
    subject: 'Please Verify Your Email Address to Complete Your Registration', // Subject line
};

function htmlBodyContent (userId) {
    const verifyLink = `${process.env.APP_URL}#/user/verification/${userId}`;
    return `<body class="bg-light">
        <div class="container">
            <img class="ax-center my-10 w-24"
                src="http://recruitfast-react-app.s3-website.us-east-2.amazonaws.com/static/media/Signup-img.0dfe087b64650fc95cef.png" />
            <div class="card p-6 p-lg-10 space-y-4">
            <h3 class="h3 fw-700">
                Please verify your e-mail?
            </h3>
                
            <p>Hi,</p>

            <p>Thank you for signing up with Shilp! To complete your registration,</p>
            
            <p>please confirm your email address by clicking the link below:</p> <a class="btn btn-primary p-3 fw-700"
             href=${verifyLink}>Verify My Email</a>

            <p>This step helps ensure the security of your account. If you did not sign up for an account with us, please disregard this email.

            If you need assistance or have any questions, don't hesitate to reach out to our support team.</p>

            <p>Best regards,</p>
            <p>The Shilp.ai Team</p>
            </div>
        </div>
    </body>`;
}

module.exports = {
    transporter,
    mailOptions,
    htmlBodyContent,
};