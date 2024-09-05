import express from 'express';
import pkg from 'pg';
import { v4 as uuidv4 } from 'uuid';  // Import uuid for UUID generation
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
router.post('/updateuser', async (req, res) => {
  const { user_id, password, enabled } = req.body;

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
      SET password = $1, enabled = $2
      WHERE user_id = $3
    `;

    // Values to be used in the SQL query
    const values = [hashedPassword, enabled, user_id];

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

export default router;
