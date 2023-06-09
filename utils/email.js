const nodemailer = require('nodemailer');

// Function to send verification email
const sendVerificationEmail = async (email, verificationLink) => {
  try {
    // Create a transporter for sending emails
    const transporter = nodemailer.createTransport({
      service: 'YourEmailService',
      auth: {
        user: process.env.email,
        pass: process.env.password,
      },
    });

    // Define the email options
    const mailOptions = {
      from: 'YourEmailAddress',
      to: email,
      subject: 'Account Verification',
      html: `<p>Please click the following link to verify your account:</p>
            <p><a href="${verificationLink}">${verificationLink}</a></p>`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
  } catch (error) {
    // Handle error
    console.error('Error sending verification email:', error);
  }
};

module.exports = {
  sendVerificationEmail,
};
