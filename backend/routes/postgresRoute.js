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

// router.get('/resetpassword', async (req, res) => {
//   const { email, password, confirmpassword } = req.body;
//   console.log(email, password, confirmpassword )
//   try {
//     const hashedpassword = await bcrypt.hash(password, saltRound);
//     const hashedconfirmpassword = await bcrypt.hash(confirmpassword, saltRound);
//     if (hashedpassword == hashedconfirmpassword) {
//       const getUserIdofEmailQuery = `
//       select id from tb_user
//       WHERE email = $1
//     `;

//       const values = [email]

//       await client.connect();
//     // Execute the update query
//     await client.query(getUserIdofEmailQuery, values);
//     res.status(200).send('try');
//     }
//   } catch (error) {
//     res.status(500).send(error);
//   }
// })

router.post('/getResetToken', async (req, res) => {
  const { email } = req.body;
  console.log(email)

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
    res.status(200).json({resetToken:resetToken})
    // res.status(200).send('User updated successfully');
  } catch (error) {
    console.error('Error updating user', error.stack);
    res.status(500).send('Error updating user');
  } finally {
    await client.end();
  }
});

export default router;
