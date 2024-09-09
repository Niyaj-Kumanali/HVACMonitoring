// Import the necessary modules
import nodemailer from 'nodemailer';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

// Create a transporter object with SMTP server details
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Ensure EMAIL_USER is set in .env
    pass: process.env.EMAIL_PASS  // Ensure EMAIL_PASS is set in .env
  },
  port: 465,
  secure: true
});


/**
 * @swagger
 * /sendresetemail:
 *   post:
 *     summary: Send a password reset email
 *     tags: [Authentication]
 *     description: Sends an email with a password reset link to the user, containing the reset token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email address of the user requesting the password reset.
 *                 example: user@example.com
 *               resetToken:
 *                 type: string
 *                 description: The reset token to be included in the email link.
 *                 example: abc12345resetToken
 *     responses:
 *       200:
 *         description: Password reset email sent successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password reset email sent successfully.
 *       400:
 *         description: Email and reset token are required.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email and reset token are required.
 *       500:
 *         description: Failed to send email.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Failed to send email.
 */

// Define the route to send the reset password email
router.post('/sendresetemail', async (req, res) => {
  const { email, resetToken } = req.body;

  if (!email || !resetToken) {
    return res.status(400).json({ message: 'Email and reset token are required.' });
  }

  try {
    // Set up the email options with a styled HTML body
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
        <div style="background-color: #fff; padding: 20px; border-radius: 5px; box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #333; text-align: center;">Password Reset Request</h2>
          <p style="font-size: 16px; color: #333;">
            Hello, <br><br>
            We received a request to reset the password associated with this email address. If you made this request, click the button below to reset your password:
          </p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="${process.env.DOMAIN}/login/resetPassword?token=${resetToken}"
              style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">Reset Password</a>
          </div>
          <p style="font-size: 16px; color: #333;">
            If you didn’t request a password reset, you can safely ignore this email. Your password will not change.
          </p>
          <p style="font-size: 14px; color: #999; text-align: center; margin-top: 30px;">
            Best regards, <br>
            The MyOorja Team
          </p>
        </div>
        <p style="font-size: 12px; color: #999; text-align: center; margin-top: 20px;">
          If the button above doesn't work, paste this link into your browser: 
          <a href="${process.env.DOMAIN}/login/resetPassword?token=${resetToken}"
             style="color: #4CAF50;">${process.env.DOMAIN}/login/resetPassword?token=${resetToken}</a>
        </p>
      </div>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Password reset email sent successfully.' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send email.' });
  }
});


export default router;
