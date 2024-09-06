import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';


dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());


const mongoUri = process.env.MONGODB_URI;

mongoose.connect(mongoUri)
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((error) => {
        console.log("Error connecting to MongoDB", error);
    });

// Swagger setup
const swaggerOptions = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "Mongo API Documentation",
            version: "1.0.0",
            description: "API documentation for warehouse and vehical management",
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 2000}`,
            },
        ],
    },
    apis: ['./routes/*.js'], // Path to the API docs
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
import warehouseRouter from './routes/warehouseRoute.js';
import coolantRouter from './routes/coolantRoute.js';
import sensorRouter from './routes/sensorRoute.js';
import vehicleRouter from './routes/vehicleRoute.js';
import postgres from './routes/postgresRoute.js'
import mailRouter from './routes/mailRouter.js'

app.use('/warehouse', warehouseRouter);
app.use('/coolant', coolantRouter);
app.use('/sensor', sensorRouter);
app.use('/vehicle', vehicleRouter);
app.use('/postgres', postgres)
app.use('/activatemail', mailRouter)



const port = process.env.PORT || 2000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
