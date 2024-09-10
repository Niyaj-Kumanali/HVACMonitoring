import express from 'express';
import { InfluxDB, Point } from '@influxdata/influxdb-client';
import bodyParser from 'body-parser';
const router = express.Router();

// InfluxDB configuration
const url = "http://3.111.205.170:8086";
const token = "jGRv8nBFrndJWL2crH4EpjfrTJS2PJMfgcOTNTFR10dnLiM0xEGtPxDkLZSbo2cuyESwO6BpNAox0Vyer4YmjQ==";
const org = "Talentpace";
const bucket = "sample_bucket";

// Initialize InfluxDB client and query API
const client = new InfluxDB({ url, token });
const queryApi = client.getQueryApi(org); // Initialize query API

// Express route to query data
router.get('/data', async (req, res) => {
  try {
    const { sensor_id } = req.query;

    // Validate sensor_id parameter
    if (!sensor_id) {
      return res.status(400).json({ message: "sensor_id query parameter is required" });
    }

    // InfluxDB query to retrieve data
    const query = `
      from(bucket: "${bucket}")
        |> range(start: -30d) // Fetch data for the last 30 days
        |> filter(fn: (r) => r["_measurement"] == "iot_measurement")
        |> filter(fn: (r) => r["sensor_id"] == "${sensor_id}")
        |> keep(columns: ["_time", "_value", "_field", "sensor_id"])
    `;

    // Execute the query
    const data = [];
    await queryApi.queryRows(query, {
      next: (row, tableMeta) => {
        const o = tableMeta.toObject(row);
        data.push({
          time: o._time,
          field: o._field,
          value: o._value,
          sensor_id: o.sensor_id,
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
