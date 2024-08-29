import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv'; // Import dotenv
dotenv.config(); 

const app = express();
app.use(cors());
app.use(bodyParser.json());


const mongoUri = process.env.MONGODB_URI

mongoose.connect(mongoUri)
.then(()=>{
    console.log("mongodb connected")
}).catch((error)=>{
    console.log("Error connecting to MongoDB", error)
});

import warehouseRouter from './routes/warehouseRoute.js'; 
import coolantRouter from './routes/coolantRoute.js'; 
import sensorRouter from './routes/sensorRoute.js'; 
import vehicleRouter from './routes/vehicleRoute.js'; 

app.use('/warehouse', warehouseRouter)
app.use('/coolant', coolantRouter)
app.use('/sensor',sensorRouter)
app.use('/vehicle',vehicleRouter)

const port = process.env.PORT || 2000;
app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`)
});