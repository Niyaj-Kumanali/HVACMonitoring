import pkg from 'pg';
const { Client } = pkg;

// PostgreSQL configuration
const config = {
  host: '3.111.205.170',
  port: 5432,
  database: 'thingsboard',
  user: 'postgres',
  password: 'Admin@123',
};

// SQL schema creation script
const signup_schema = `
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

  CREATE TABLE IF NOT EXISTS tb_user (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_time BIGINT DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT,
    additional_info VARCHAR(255) DEFAULT '{}',
    customer_id VARCHAR(255) DEFAULT '',
    authority VARCHAR(255) DEFAULT '',
    first_name VARCHAR(255) DEFAULT '',
    last_name VARCHAR(255) DEFAULT '',
    phone VARCHAR(255) DEFAULT '',
    email VARCHAR(255) UNIQUE DEFAULT '',
    tenant_id VARCHAR(255) DEFAULT ''
  );
`;
// SQL schema creation script
// const userCredentialsSchema = `
//   CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

//   CREATE TABLE IF NOT EXISTS user_credentials (
//     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
//     created_time BIGINT NOT NULL DEFAULT EXTRACT(EPOCH FROM NOW()),
//     activate_token VARCHAR(255),
//     enabled BOOLEAN DEFAULT FALSE,
//     password VARCHAR(255),
//     reset_token VARCHAR(255),
//     user_id UUID UNIQUE NOT NULL,
//     additional_info VARCHAR DEFAULT '{}'::VARCHAR
//   );
// `;

// Function to create the schema
const SignupSchema = async () => {
  const client = new Client(config);

  try {
    await client.connect();
    console.log('Connected to PostgreSQL');

    await client.query(signup_schema);
    await client.query(userCredentialsSchema);
    console.log('Schema created successfully');
    return client

  } catch (err) {
    console.error('Error creating schema', err.stack);
  } finally {
    await client.end();
  }
};

export default SignupSchema;
