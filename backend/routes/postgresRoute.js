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

/**
 * @swagger
 * /setpassword:
 *   post:
 *     summary: Set a new password for the user
 *     tags: [Authentication]
 *     description: Allows a user to set a new password using an activation token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *                 description: The ID of the user.
 *                 example: 12345
 *               password:
 *                 type: string
 *                 description: The new password to set.
 *                 example: mynewpassword123
 *               activateToken:
 *                 type: string
 *                 description: The activation token sent to the user.
 *                 example: abc123activatetoken
 *     responses:
 *       200:
 *         description: Password updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password updated successfully.
 *       400:
 *         description: User ID, password, and activation token are required.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User ID, password, and activation token are required.
 *       404:
 *         description: User not found or invalid activation token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found or invalid activation token.
 *       500:
 *         description: Error updating user password.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error updating user password.
 *                 error:
 *                   type: string
 *                   example: Error details...
 */

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
                .json({
                    message: 'User not found or invalid activation token.',
                });
        }

        res.status(200).json({ message: 'Password updated successfully.' });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({
            message: 'Error updating user password.',
            error: error.message,
        });
    } finally {
        await client.end();
    }
});

/**
 * @swagger
 * /resettoken:
 *   get:
 *     summary: Retrieve or generate a password reset token
 *     tags: [Authentication]
 *     description: Retrieves the reset token for the user with the provided email. If no valid token is found or it has expired, a new token is generated.
 *     parameters:
 *       - in: query
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: The email address of the user.
 *         example: user@example.com
 *     responses:
 *       200:
 *         description: Reset token retrieved or generated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: The reset token.
 *                   example: abc123resettoken
 *                 userId:
 *                   type: string
 *                   description: The user ID associated with the email.
 *                   example: 12345
 *       400:
 *         description: Email is required.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email is required.
 *       404:
 *         description: User with the given email not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User with the given email not found.
 *       500:
 *         description: Error retrieving reset token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error retrieving reset token.
 *                 error:
 *                   type: string
 *                   example: Error details...
 */

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
        res.status(500).json({
            message: 'Error retrieving reset token.',
            error: error.message,
        });
    } finally {
        await client.end();
    }
});

/**
 * @swagger
 * /resetpassword:
 *   post:
 *     summary: Reset user password
 *     tags: [Authentication]
 *     description: Resets the user password using the provided reset token. If the token is valid and has not expired, the password is updated, and a new reset token is generated.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               resetToken:
 *                 type: string
 *                 description: The reset token provided to the user.
 *                 example: abc123resettoken
 *               password:
 *                 type: string
 *                 description: The new password to set.
 *                 example: newpassword123
 *     responses:
 *       200:
 *         description: Password reset successfully. A new reset token has been generated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password reset successfully. A new reset token has been generated.
 *       400:
 *         description: Reset token and password are required.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Reset token and password are required.
 *       401:
 *         description: Reset token has expired.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Reset token has expired.
 *       404:
 *         description: Invalid reset token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid reset token.
 *       500:
 *         description: Error resetting password.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error resetting password.
 *                 error:
 *                   type: string
 *                   example: Error details...
 */

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

            const values = [
                hashedPassword,
                newResetToken,
                newExpiration,
                resetToken,
            ];
            await client.query(updateQuery, values);

            res.status(200).json({
                message:
                    'Password reset successfully. A new reset token has been generated.',
            });
        } else {
            res.status(401).json({ message: 'Reset token has expired.' });
        }
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({
            message: 'Error resetting password.',
            error: error.message,
        });
    } finally {
        await client.end();
    }
});

/**
 * @swagger
 * /warehouse_averages:
 *   get:
 *     summary: Get average combined values for keys
 *     tags: [Analytics]
 *     description: Retrieves the average combined values of `dbl_v` and `long_v` from the `device` table, grouped by key from the `key_dictionary` table, filtered by device label.
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The label of the device to filter the results by.
 *     responses:
 *       200:
 *         description: Successfully retrieved the average combined values for keys.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               additionalProperties:
 *                 type: number
 *                 description: The average combined value for each key.
 *                 example:
 *                   key1: 10.5
 *                   key2: 20.3
 *       400:
 *         description: The `id` parameter is required.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Id is required
 *       500:
 *         description: Internal Server Error occurred while executing the query.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal Server Error
 */
router.get('/warehouse_averages', async (req, res) => {
    const { id } = req.query;

    if (!id) {
        return res.status(400).json({ error: 'Id is required' });
    }

    const client = createClient();

    try {
        await client.connect();

        const query = `
      SELECT
          kd.key,
          AVG(COALESCE(dbl_v, 0) + COALESCE(long_v, 0)) AS avg_combined_v
      FROM
          device AS d
      JOIN ts_kv AS ts ON d.id = ts.entity_id
      JOIN key_dictionary AS kd ON kd.key_id = ts.key
      WHERE
          d.label = $1
      GROUP BY
          kd.key
      ORDER BY
          kd.key;
    `;

        const result = await client.query(query, [id]);

        // Transform the result into the desired format
        const transformedResult = result.rows.reduce((acc, row) => {
            acc[row.key] = row.avg_combined_v;
            return acc;
        }, {});

        res.json(transformedResult);
    } catch (error) {
        console.error('Error executing query', error.stack);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await client.end();
    }
});

router.post('/warehouse_violations', async (req, res) => {
    const { id, keys } = req.body; // Changed to req.body to handle JSON input

    // Validate required fields
    if (!id || !keys || typeof keys !== 'object') {
        return res
            .status(400)
            .json({ error: 'Id and valid keys are required' });
    }

    const client = createClient();

    try {
        await client.connect();

        const results = {};

        // Iterate over each key-value pair in keys object
        for (const [key, threshold] of Object.entries(keys)) {
            const query = `
        SELECT COUNT(*)
        FROM device d
        JOIN ts_kv ts ON d.id = ts.entity_id
        JOIN key_dictionary kd ON kd.key_id = ts.key
        WHERE label = $1
        AND COALESCE(ts.dbl_v, 0) + COALESCE(ts.long_v, 0) > $3
        AND kd.key = $2
      `;

            // Execute query for each key with its corresponding threshold
            const result = await client.query(query, [id, key, threshold]);

            // Extract the count and store in results object
            results[key] = result.rows[0].count;
        }

        // Send the final results as a JSON response
        res.json(results);
    } catch (error) {
        console.error('Error executing query', error.stack);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await client.end();
    }
});

router.post('/updatedevices', async (req, res) => {
  const { id, devices } = req.body;

  const client = createClient();

  try {
      await client.connect();

      const query = `
          UPDATE device
          SET label = $1
          WHERE id = $2
      `;

      // Updating each device in the list
      const results = [];
      for (const deviceId of devices) {
          const result = await client.query(query, [id, deviceId]);
          results.push(result);
      }

      res.json({ message: 'Devices updated successfully', results });
  } catch (error) {
      console.error('Error executing query', error.stack);
      res.status(500).json({ error: 'Internal Server Error' });
  } finally {
      await client.end();
  }
});


export default router;
