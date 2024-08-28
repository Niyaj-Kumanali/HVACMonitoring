import express from 'express';
import sensor from '../schemas/sensors_metadata.js'; // Make sure to include the .js extension or adjust based on your file structure
import warehouse from '../schemas/warehouse_metadata.js'; // Make sure to include the .js extension or adjust based on your file structure
import { model } from 'mongoose';

const router = express.Router();

// create a new sensor
router.post('/addsensor', async(req, res) => {
    try {
        const newsensor = new sensor(req.body);
        await newsensor.save();
        res.status(201).send(newsensor);
    } catch (error) {
        res.status(400).send(error)
    }
})

// get all sensors
router.get('/getallsensors', async(req, res) => {
    try {
        const allsensors = await sensor.find();
        res.status(201).json(allsensors) 
    } catch (error) {
        res.status(400).send(error)
    }
});

// get avaliable sensors , which are not in use
router.get('/getavaliablesensors', async(req, res) => {
    try {
        const allsensors = await sensor.find();

        const allwarehouse = await warehouse.find()
        .populate({
            path: 'sensors.sensor',
            select: 'sensor_id'
        })
        .exec();

        const usedSensordIds = new Set();
        allwarehouse.forEach(warehouse => {
            warehouse.sensors.forEach(unit => {
                if(unit.sensor && unit.sensor.sensor_id){
                    usedSensordIds.add(unit.sensor.sensor_id)
                }
            })
        })

        const avaliableSensors = allsensors.filter(sensor => !usedSensordIds.has(sensor.sensor_id))

        res.status(200).json(avaliableSensors)

    } catch (error) {
        res.status(400).send({ message: 'Error retrieving available sensors', error });
    }
});

export default router;