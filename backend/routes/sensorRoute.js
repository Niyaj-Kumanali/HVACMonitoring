import express from 'express';
import sensor from '../schemas/sensors_metadata.js'; // Make sure to include the .js extension or adjust based on your file structure
import warehouse from '../schemas/warehouse_metadata.js'; // Make sure to include the .js extension or adjust based on your file structure
import { model } from 'mongoose';

const router = express.Router();

// create a new sensor
router.post('/addsensor', async(req, res) => {
    try {
        const existingSensor = await sensor.findOne({
            sensor_id: req.body.sensor_id
        });

        if(existingSensor){
            return res.status(409).send({ message: 'Sensor already exists' });
        }


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

//get sensor by id
router.get('/getsensor/:sensor_id', async (req, res) => {
    try {
        const { sensor_id } = req.params;

        // Find the sensor by sensor_id
        const getsensor = await sensor.findOne({ sensor_id });

        // Check if the sensor was found
        if (!getsensor) {
            return res.status(404).json({ message: 'Sensor not found' });
        }

        // Respond with the found sensor
        res.status(200).json(getsensor);
    } catch (error) {
        console.error('Error retrieving sensor:', error);
        res.status(400).send(error.message);
    }
});

// Route to delete sensor by ID
router.delete('/deletesensor/:sensor_id', async (req, res) => {
    try {
        const { sensor_id } = req.params;

        // Find and delete the sensor by sensor_id
        const deletedSensor = await sensor.findOneAndDelete({ sensor_id });

        // Check if the sensor was deleted
        if (!deletedSensor) {
            return res.status(404).json({ message: 'Sensor not found' });
        }

        // Respond with a success message
        res.status(200).json({ message: 'Sensor deleted successfully' });
    } catch (error) {
        console.error('Error deleting sensor:', error);
        res.status(400).send(error.message);
    }
});

// get avaliable sensors , which are not in use
// router.get('/getavaliablesensors', async(req, res) => {
//     try {
//         const allsensors = await sensor.find();

//         const allwarehouse = await warehouse.find()
//         .populate({
//             path: 'sensors.sensor',
//             select: 'sensor_id'
//         })
//         .exec();

//         const usedSensordIds = new Set();
//         allwarehouse.forEach(warehouse => {
//             warehouse.sensors.forEach(unit => {
//                 if(unit.sensor && unit.sensor.sensor_id){
//                     usedSensordIds.add(unit.sensor.sensor_id)
//                 }
//             })
//         })

//         const avaliableSensors = allsensors.filter(sensor => !usedSensordIds.has(sensor.sensor_id))

//         res.status(200).json(avaliableSensors)

//     } catch (error) {
//         res.status(400).send({ message: 'Error retrieving available sensors', error });
//     }
// });

export default router;