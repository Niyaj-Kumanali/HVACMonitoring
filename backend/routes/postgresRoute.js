import express from 'express';
import pkg from 'pg';
import bcrypt from 'bcrypt';

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

// Endpoint to create and update user password
router.post('/setpassword', async (req, res) => {
  const { user_id, password, activateToken } = req.body;

  if (!user_id || !password || !activateToken) {
    return res.status(400).json({ message: 'User ID, password, and activation token are required.' });
  }

  const client = createClient();
  
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRound);

    // SQL query to update password and enabled status
    const passwordQuery = `
      UPDATE user_credentials
      SET password = $1, enabled = true, reset_token = $2
      WHERE user_id = $3
    `;
    
    // Values to be used in the SQL query
    const values = [hashedPassword, activateToken, user_id];

    await client.connect();

    // Execute the update query
    const result = await client.query(passwordQuery, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({ message: 'Password updated successfully.' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user password.', error: error.message });
  } finally {
    await client.end();
  }
});

// Endpoint to get reset token based on email
router.get('/resettoken', async (req, res) => {
  const {email} = req.query;

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
      SELECT reset_token
      FROM user_credentials
      WHERE user_id = $1
      LIMIT 1
    `;

    await client.connect();

    // Find the user ID by email
    const userResult = await client.query(userIdQuery, [email]);
    if (userResult.rowCount === 0) {
      return res.status(404).json({ message: 'User with the given email not found.' });
    }

    const userId = userResult.rows[0].id;

    // Find the reset token by user ID
    const tokenResult = await client.query(resetTokenQuery, [userId]);
    if (tokenResult.rowCount === 0) {
      return res.status(404).json({ message: 'Reset token not found for the given user.' });
    }

    const resetToken = tokenResult.rows[0].reset_token;

    res.status(200).json({ resetToken, userId });
  } catch (error) {
    console.error('Error retrieving reset token:', error);
    res.status(500).json({ message: 'Error retrieving reset token.', error: error.message });
  } finally {
    await client.end();
  }
});

// Endpoint to reset password using reset token
router.post('/resetpassword', async (req, res) => {
  const { resetToken, password } = req.body;

  if (!resetToken || !password) {
    return res.status(400).json({ message: 'Reset token and password are required.' });
  }

  const client = createClient();

  try {
    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, saltRound);

    // SQL query to update password
    const passwordQuery = `
      UPDATE user_credentials
      SET password = $1, enabled = true
      WHERE reset_token = $2
    `;

    const values = [hashedPassword, resetToken];

    await client.connect();

    const result = await client.query(passwordQuery, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Invalid reset token.' });
    }

    res.status(200).json({ message: 'Password updated successfully.' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Error resetting password.', error: error.message });
  } finally {
    await client.end();
  }
});

export default router;
