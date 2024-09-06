import express from 'express';
import pkg from 'pg';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const { Client } = pkg;
const saltRound = 10;

// PostgreSQL configuration
const config = {
  host: '3.111.205.170',
  port: 5432,
  database: 'thingsboard',
  user: 'postgres',
  password: 'Admin@123',
};

const router = express.Router();

// Helper function to create database client
const createClient = () => new Client(config);

// Helper function to generate reset token with expiration
function generateResetToken() {
  const randomBytes = crypto.randomBytes(27);
  let token = randomBytes.toString('base64');
  token = token.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  // const expiration = new Date(Date.now() + 3600000); // 1 hour from now
  const expiration = new Date(Date.now() + 300000); // 5 minutes from now
  // const expiration = new Date(Date.now() + 1000); // 1 seconds from now
  return { token, expiration };
}

// Endpoint to create and update user password
router.post('/setpassword', async (req, res) => {
  const { user_id, password, activateToken } = req.body;

  if (!user_id || !password || !activateToken) {
    return res.status(400).json({
      message: 'User ID, password, and activation token are required.',
    });
  }

  const client = createClient();

  try {
    const hashedPassword = await bcrypt.hash(password, saltRound);
    const { token } = generateResetToken();

    const passwordQuery = `
      UPDATE user_credentials
      SET password = $1, enabled = true, reset_token = $2, reset_token_expiration = NULL
      WHERE user_id = $3 AND activate_token = $4
    `;

    const values = [hashedPassword, token, user_id, activateToken];

    await client.connect();
    const result = await client.query(passwordQuery, values);

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ message: 'User not found or invalid activation token.' });
    }

    res.status(200).json({ message: 'Password updated successfully.' });
  } catch (error) {
    console.error('Error updating user:', error);
    res
      .status(500)
      .json({ message: 'Error updating user password.', error: error.message });
  } finally {
    await client.end();
  }
});

// Endpoint to get reset token based on email
router.get('/resettoken', async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  const client = createClient();

  try {
    const userIdQuery = `
      SELECT id
      FROM tb_user
      WHERE email = $1
      LIMIT 1
    `;

    const resetTokenQuery = `
      SELECT reset_token, reset_token_expiration
      FROM user_credentials
      WHERE user_id = $1
      LIMIT 1
    `;

    await client.connect();

    const userResult = await client.query(userIdQuery, [email]);
    if (userResult.rowCount === 0) {
      return res
        .status(404)
        .json({ message: 'User with the given email not found.' });
    }

    const userId = userResult.rows[0].id;

    const tokenResult = await client.query(resetTokenQuery, [userId]);
    const { reset_token: resetToken, reset_token_expiration: expiration } =
      tokenResult.rows[0] || {};

    const now = new Date();
    if (!resetToken || (expiration && now > new Date(expiration))) {
      const { token: newToken, expiration: newExpiration } =
        generateResetToken();
      await client.query(
        `
        UPDATE user_credentials
        SET reset_token = $2, reset_token_expiration = $3
        WHERE user_id = $1
      `,
        [userId, newToken, newExpiration]
      );
      res.status(200).json({ token: newToken, userId });
    } else {
      res.status(200).json({ resetToken, userId });
    }
  } catch (error) {
    console.error('Error retrieving reset token:', error);
    res
      .status(500)
      .json({ message: 'Error retrieving reset token.', error: error.message });
  } finally {
    await client.end();
  }
});

// Endpoint to reset password using reset token
router.post('/resetpassword', async (req, res) => {
  const { resetToken, password } = req.body;

  if (!resetToken || !password) {
    return res
      .status(400)
      .json({ message: 'Reset token and password are required.' });
  }

  const client = createClient();

  try {
    const hashedPassword = await bcrypt.hash(password, saltRound);
    const { token: newResetToken, expiration: newExpiration } =
      generateResetToken();

    // Check if the token is valid and has not expired
    const passwordQuery = `
      SELECT reset_token_expiration
      FROM user_credentials
      WHERE reset_token = $1
    `;

    await client.connect();
    const result = await client.query(passwordQuery, [resetToken]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Invalid reset token.' });
    }

    const { reset_token_expiration: expiration } = result.rows[0];

    // Check if the current time is past the expiration time
    const now = new Date();
    if (expiration && now <= new Date(expiration)) {
      // Token is valid, update password and reset token
      const updateQuery = `
        UPDATE user_credentials
        SET password = $1,
            enabled = true,
            reset_token = $2,
            reset_token_expiration = $3
        WHERE reset_token = $4
      `;

      const values = [hashedPassword, newResetToken, newExpiration, resetToken];
      await client.query(updateQuery, values);

      res.status(200).json({
        message:
          'Password reset successfully. A new reset token has been generated.',
      });
    } else {
      res.status(400).json({ message: 'Reset token has expired.' });
    }
  } catch (error) {
    console.error('Error resetting password:', error);
    res
      .status(500)
      .json({ message: 'Error resetting password.', error: error.message });
  } finally {
    await client.end();
  }
});

export default router;
