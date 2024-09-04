import { Client } from 'pg';

// PostgreSQL configuration
const config = {
  host: '3.111.205.170',
  port: 5432,
  database: 'thingsboard',
  user: 'postgres',
  password: 'Admin@123',
};

// Define the configuration type
type Config = {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
};

// Function to connect to PostgreSQL
const connectToPostgres = async (): Promise<void> => {
  const client = new Client(config as Config);

  try {
    await client.connect();
    console.log('Connected to PostgreSQL');
    
    // Your query code here

  } catch (err) {
    console.error('Error connecting to PostgreSQL', (err as Error).stack);
  } finally {
    await client.end();
  }
};

// Named Export
export { connectToPostgres };

// Default Export
export default connectToPostgres;
