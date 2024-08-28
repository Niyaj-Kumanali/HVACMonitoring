import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';


const app = express();
app.use(cors());
app.use(bodyParser.json());


const mongoUri = 'mongodb+srv://sainaath4763:sainaath4763@cluster0.e0to7dq.mongodb.net/IoT_Test';

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


app.listen(2000, ()=>{
    console.log("port is running on 2000")
});