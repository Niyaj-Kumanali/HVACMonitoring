import express from 'express';
import SignupSchema from '../schemas/signup_metadata.js';
import pkg from 'pg';
import { v4 as uuidv4 } from 'uuid';  // Import uuid for UUID generation

const { Client } = pkg;

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

// Endpoint to add a user for signup
router.post('/adduserforsignup', async (req, res) => {
  const response = await SignupSchema();
  // console.log(response)

  const { first_name, last_name, email, password, phone, authority, additional_info, tenant_id, activate_token, customer_id } = req.body;

  const userId = uuidv4();  // Generate a UUID for the user ID
  const createdTime = Date.now();  // Get current time in milliseconds

  const insertQuery = `
    INSERT INTO tb_user (id, first_name, last_name, email, phone, authority, additional_info, tenant_id, customer_id, created_time)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
  `;

  const passwordQuery = `
    INSERT INTO user_credentials (activate_token, enabled, password, reset_token, user_id, additional_info)
    VALUES ($1, $2, $3, $4, $5, $6)
  `;

  const enabled = true;  // Assuming you want to enable the user by default

  const client = new Client(config);
  try {
    await client.connect();

    // Insert into user table
    await client.query(insertQuery, [
      userId,
      createdTime,  // Explicitly set created_time
      additional_info,
      customer_id,
      authority,
      first_name,
      last_name,
      phone,
      email,
      tenant_id,  
    ]);

    // Insert into user_credentials table
    await client.query(passwordQuery, [
      userId,
      createdTime,
      activate_token,
      enabled,
      password,
      null,  // Assuming reset_token is null for new users
      userId,
      additional_info
    ]);

    res.status(201).send('User added successfully');
  } catch (error) {
    console.error('Error adding user', error.stack);
    res.status(500).send('Error adding user');
  } finally {
    await client.end();
  }
});


export default router;
