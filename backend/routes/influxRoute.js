import express from 'express';
import { InfluxDB } from '@influxdata/influxdb-client';

const router = express.Router();

// InfluxDB configuration
const url = "http://3.111.205.170:8086";
const token = "jGRv8nBFrndJWL2crH4EpjfrTJS2PJMfgcOTNTFR10dnLiM0xEGtPxDkLZSbo2cuyESwO6BpNAox0Vyer4YmjQ==";
const org = "Talentpace";
const bucket = "sample_bucket";

// Initialize InfluxDB client and query API
const client = new InfluxDB({ url, token });
const queryApi = client.getQueryApi(org); // Initialize query API

// Express route to query data with pagination
router.get('/data', async (req, res) => {
  try {
    // Pagination parameters
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not specified
    const limit = parseInt(req.query.limit) || 10; // Default to 10 records per page if not specified

    // InfluxDB query to retrieve data with pagination
    const query = `
      from(bucket: "${bucket}")
        |> range(start: -30d) // Fetch data for the last 30 days
        |> filter(fn: (r) => r["_measurement"] == "PI")
        |> keep(columns: ["_time", "_value", "_field", "sensor_Type"])
        |> limit(n: ${limit}, offset: ${(page - 1) * limit})
    `;

    // Execute the query
    const data = [];
    await queryApi.queryRows(query, {
      next: (row, tableMeta) => {
        const o = tableMeta.toObject(row);
        data.push({
          time: o._time,  // ISO 8601 date string
          value: o._value,  // Numeric value
          field: o._field,  // Field name
          sensor_Type: o.sensor_Type,  // Sensor type
        });
      },
      error: (error) => {
        console.error('Error executing query:', error);
        res.status(500).json({ message: 'Error querying data from InfluxDB' });
      },
      complete: () => {
        res.json(data);
      }
    });
  } catch (error) {
    console.error('Error querying data:', error);
    res.status(500).json({ message: 'Failed to query data from InfluxDB' });
  }
});

export default router;
