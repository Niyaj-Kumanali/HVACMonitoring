import pkg from 'pg';
const { Client } = pkg;
import { InfluxDB, Point } from '@influxdata/influxdb-client';

// PostgreSQL configuration
const dbConfig = {
  host: "3.111.205.170",  // Replace with your EC2 instance public IP or DNS name
  port: 5432,  // Default PostgreSQL port
  database: "thingsboard",
  user: "postgres",
  password: "Admin@123"
};

// InfluxDB configuration
const influxConfig = {
  url: "http://3.111.205.170:8086/",
  token: "jGRv8nBFrndJWL2crH4EpjfrTJS2PJMfgcOTNTFR10dnLiM0xEGtPxDkLZSbo2cuyESwO6BpNAox0Vyer4YmjQ==",
  org: "Talentpace",
  bucket: "sample_bucket"
};

// Create a PostgreSQL client
const pgClient = new Client(dbConfig);

// Create InfluxDB client
const influxClient = new InfluxDB({ url: influxConfig.url, token: influxConfig.token });
const writeApi = influxClient.getWriteApi(influxConfig.org, influxConfig.bucket, 'ns');

// Connect to the PostgreSQL database and fetch data
pgClient.connect()
  .then(() => {
    console.log("Connected to PostgreSQL database");

    // Example query to fetch data from master_table
    const query = "SELECT * FROM master_sample;";

    return pgClient.query(query);
  })
  .then(result => {
    const records = result.rows;

    // Process each record and write to InfluxDB
    records.forEach(record => {
      try {
        const sensor_type = record.key;
        const int_temperature = record.long_v;  // Adjust to match actual column names
        const float_temperature = record.dbl_v;  // Adjust to match actual column names

        // Determine the correct temperature value
        const temperature = float_temperature !== null ? float_temperature : int_temperature;

        // Convert timestamp to nanoseconds if it's in milliseconds
        const timestamp_ns = record.ts * 1e6;

        // Write data to InfluxDB
        const point = new Point('PI')
          .tag('sensor_Type', sensor_type)
          .floatField('temperature', temperature)
          .timestamp(timestamp_ns);

        writeApi.writePoint(point);
        console.log(`Written to InfluxDB: sensor_id=${record.device_id}, temperature=${temperature}, timestamp=${timestamp_ns}`);
      } catch (err) {
        console.error(`Error processing record ${record.device_id}:`, err);
      }
    });

    // Flush the InfluxDB write API
    return writeApi.flush();
  })
  .then(() => {
    console.log("Data has been written to InfluxDB. Bucket:", influxConfig.bucket);
  })
  .catch(err => {
    console.error("Error occurred during database operations:", err);
  })
  .finally(() => {
    // Close PostgreSQL client
    pgClient.end()
      .then(() => console.log("PostgreSQL connection closed"))
      .catch(err => console.error("Error closing PostgreSQL connection:", err));

    // Close InfluxDB write API
    writeApi.close()
      .then(() => console.log("InfluxDB write API closed"))
      .catch(err => console.error("Error closing InfluxDB write API:", err));
  });
