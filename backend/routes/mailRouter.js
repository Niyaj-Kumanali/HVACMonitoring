// Import the necessary modules
import nodemailer from 'nodemailer';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

// Create a transporter object with SMTP server details (You can use Gmail or any other email service like 'smtp.mailtrap.io')
const transporter = nodemailer.createTransport({
  service: 'gmail', // or any other email service like 'smtp.mailtrap.io'
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS  // Your email password
  },
  port: 465,
  secure: true
});

// Define the route to send the reset password email
router.post('/send-reset-email', async (req, res) => {
  const { email, resetToken } = req.body;

  // if (!email || !resetToken) {
  //   return res.status(400).send('Email and reset token are required');
  // }
  console.log(process.env.EMAIL_USER, process.env.EMAIL_PASS)

  try {
    // Set up the email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset',
      text: `You requested a password reset. Use the token: ${resetToken} to reset your password.`,
      html: `<p>You requested a password reset.</p><p>Click <a href="http://myoorja.in/login/resetPassword?token=${resetToken == null ? "123456": resetToken}">here</a> to reset your password.</p>`
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    res.status(200).send('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Failed to send email');
  }
});

export default router;
