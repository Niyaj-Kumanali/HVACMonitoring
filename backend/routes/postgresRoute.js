import express from 'express';
import pkg from 'pg';
import { v4 as uuidv4 } from 'uuid';  // Import uuid for UUID generation
import bcrypt from 'bcrypt';
// import resetPassword from '../../frontend/src/api/loginApi'

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

// Endpoint to test PostgreSQL connection
router.get('/connect-postgres', async (req, res) => {
  const client = new Client(config);
  try {
    await client.connect();
    console.log('Connected to PostgreSQL');
    res.status(200).json({ message: 'Connected to PostgreSQL' });
  } catch (err) {
    console.error('Error connecting to PostgreSQL', err.stack);
    res.status(500).json({ error: 'Error connecting to PostgreSQL' });
  } finally {
    await client.end();
  }
});

// Endpoint to update a user's password and enabled status
router.post('/createPassword', async (req, res) => {
  const { user_id, password, enabled, activateToken } = req.body;

  if (!user_id || !password) {
    return res.status(400).send('User ID and password are required');
  }

  const client = new Client(config);

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRound);
    // SQL query to update password and enabled status
    const passwordQuery = `
      UPDATE user_credentials
      SET password = $1, enabled = $2, reset_token = $4
      WHERE user_id = $3
    `;
    // Values to be used in the SQL query
    const values = [hashedPassword, enabled, user_id, activateToken];
    // Connect to the database
    await client.connect();
    // Execute the update query
    await client.query(passwordQuery, values);
    res.status(200).send('User updated successfully');
  } catch (error) {
    console.error('Error updating user', error.stack);
    res.status(500).send('Error updating user');
  } finally {
    await client.end();
  }
});

router.post('/resetpasswordforresttoken', async (req, res) => {
  const { resetToken, password, confirmpassword, user_id } = req.body;
  console.log("resetpasswordforresttoken", resetToken, password, confirmpassword);

  const client = new Client(config);

  if (!resetToken || !password || !confirmpassword || !user_id) {
    return res.status(400).send('All fields are required');
  }

  try {
    // Check if passwords match before hashing
    if (password !== confirmpassword) {
      return res.status(400).send('Passwords do not match');
    }

    // Hash the password
    const hashedpassword = await bcrypt.hash(password, saltRound);

    // Prepare the query
    const resetPasswordQuery = `
      UPDATE user_credentials
      SET password = $1, reset_token = NULL
      WHERE user_id = $2 AND reset_token = $3;
    `;
    
    const values = [hashedpassword, user_id, resetToken];

    // Connect to the database and execute the query
    await client.connect();
    const result = await client.query(resetPasswordQuery, values);

    // Check if any rows were affected by the query
    if (result.rowCount === 0) {
      return res.status(400).send('Invalid reset token or user ID');
    }

    res.status(200).send('Password has been successfully reset');
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).send('Internal Server Error');
  } finally {
    // Ensure the client is closed after the query
    await client.end();
  }
});

router.post('/getResetToken', async (req, res) => {
  const { email } = req.body;
  console.log("/getResetToken", email)

  if (!email) {
    return res.status(400).send('email is required');
  }

  const client = new Client(config);

  try {
    const userIdQuery = `
      select id
      from tb_user
      WHERE email = $1
    `;

    const resetTokenQuery = `
      select reset_token
      from user_credentials
      where user_id = $1
    `
    // Connect to the database
    await client.connect();
    // Execute the update query
    const result = await client.query(userIdQuery, [email]);
    const userId = result.rows[0].id
    console.log(userId)
    const response = await client.query(resetTokenQuery, [userId])
    const resetToken = response.rows[0].reset_token
    console.log(resetToken)
    res.status(200).json({ resetToken: resetToken, userId: userId })
    // res.status(200).send('User updated successfully');
  } catch (error) {
    console.error('Error updating ResetToken', error.stack);
    res.status(500).send('Error updating ResetToken');
  } finally {
    await client.end();
  }
});

export default router;
