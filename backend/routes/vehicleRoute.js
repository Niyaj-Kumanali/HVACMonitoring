import express from 'express';
import vehicle from '../schemas/vehicle_metadata.js'; // Make sure to include the .js extension or adjust the path based on your project structure

const router = express.Router();

// create a new vehicle
router.post('/addvehicle', async(req, res) => {
    try {
        const newvehicle = new vehicle(req.body);
        await newvehicle.save();
        res.status(201).send(newvehicle);
    } catch (error) {
        res.status(400).send(error)
    }
});

// get all vehicles
router.get('/getallvehicle', async(req, res) => {
    try {
        const getallvehicle = await vehicle.find()
        .populate({
            path: 'cooling_units.coolant',
            select: 'coolant_id'  
        })
        .populate({
            path: 'sensors.sensor',
            select: 'sensor_id indoor_location Type date_of_installation' 
        })
        .exec();

        if (!getallvehicle) {
            return res.status(404).json({ message: 'vehicle not found' });
        }
        res.status(200).json(getallvehicle);
    } catch (error) {
        res.status(400).send(error)
    }
});

// get vehicle by vehicle_id
router.get('/getbyvehicleid/:vehicle_id', async(req, res) => {
    try {
        const {vehicle_id} = req.params;
        const vehicleData = await vehicle.findOne({ vehicle_id })
        .populate({
            path: 'cooling_units.coolant',
            select: 'coolant_id location_in_warehouse'
        })
        .populate({
            path: 'sensors.sensor',
            select: 'sensor_id indoor_location Type date_of_installation'
        })
        .exec();

        if (!vehicleData) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        res.json(vehicleData);
    } catch (error) {
        console.error("Error fetching vehicle:", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

export default router