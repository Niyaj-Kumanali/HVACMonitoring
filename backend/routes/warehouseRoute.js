import express from 'express';
import warehouse from '../schemas/warehouse_metadata.js'; // Make sure to add the .js extension or update the path based on your project structure
const router = express.Router();
import mongoose from 'mongoose';

// create a new warehouse
router.post('/addwarehouse', async(req, res) =>{
    try {

        const existingWarehouse = await warehouse.findOne({
            $or: [
                {warehouse_id: req.body.warehouse_id},
                {warehouse_name: req.body.warehouse_name}
            ]
        })

        if (existingWarehouse) {
            return res.status(409).send({ message: 'Warehouse already exists' });
        }


        const newwarehouse = new warehouse(req.body);
        await newwarehouse.save();
        res.status(201).send(newwarehouse);
    } catch (error) {
        res.status(400).send(error);
    }
});

//  get all warehouses
router.get('/getallwarehouse', async(req, res) => {
    try {
        // const getallwarehouse = await warehouse.find()
        // .populate({
        //     path: 'cooling_units.coolant',
        //     select: 'coolant_id location_in_warehouse'  
        // })
        // .populate({
        //     path: 'sensors.sensor',
        //     select: 'sensor_id indoor_location Type date_of_installation' 
        // })
        // .exec();

        const getallwarehouse = await warehouse.find();

        if (!getallwarehouse) {
            return res.status(404).json({ message: 'Warehouse not found' });
        }
        res.status(200).json(getallwarehouse);
    } catch (error) {
        
        res.status(500).json({ message: 'Error retrieving warehouse data', error });
    }
});

// get warehouse by warehouse_id
router.get('/getwarehouse/:warehouse_id', async(req, res) => {
    try {
        const { warehouse_id } = req.params;
        // const getwarehouse = await warehouse.findOne({ warehouse_id })
        // .populate({
        //     path: 'cooling_units.coolant',
        //     select: 'coolant_id location_in_warehouse'  
        // })
        // .populate({
        //     path: 'sensors.sensor',
        //     select: 'sensor_id indoor_location Type date_of_installation' 
        // })
        // .exec();

        const getwarehouse = await warehouse.findOne({warehouse_id})

        if (!getwarehouse) {
            return res.status(404).json({ message: 'Warehouse not found' });
        }
        res.status(200).json(getwarehouse);
    } catch (error) {
        
        res.status(500).json({ message: 'Error retrieving warehouse data', error });
    }
});

// delete a warehouse by id
router.delete('/deletewarehouse/:warehouse_id', async (req, res) => {
    try {
        const { warehouse_id } = req.params;

        // Adjust the query based on your Mongoose schema
        const result = await warehouse.findOneAndDelete({ warehouse_id });

        if (!result) {
            return res.status(404).send({ message: 'Warehouse not found' });
        }

        res.status(200).send({ message: 'Warehouse deleted successfully' });
    } catch (error) {
        console.error('Error deleting warehouse:', error); // Improved logging
        res.status(500).send({ message: 'Error deleting warehouse', error });
    }
});


// add indoor_location and data_of_installation
// router.put('/updatewarehouse/:warehouse_id', async (req, res) => {
//     try {
//         const { warehouse_id } = req.params;
        
//         const { sensors } = req.body; // Extract sensors from request body
//         // console.log(sensors)

//         // Find the warehouse and populate related fields
//         const warehousedata = await warehouse.findOne({ warehouse_id })
//             .populate({
//                 path: 'cooling_units.coolant',
//                 select: 'coolant_id location_in_warehouse'  
//             })
//             .populate({
//                 path: 'sensors.sensor',
//                 select: 'sensor_id indoor_location Type date_of_installation' 
//             })
//             .exec();

//         // Create a map for quick lookup of sensor IDs
//         const sensorMap = new Map();
//         warehousedata.sensors.forEach((item) => {
//             console.log(item)
//             sensorMap.set(item.sensor.indoor_location, item);
//         });

//         // Update the sensors with new locations
//         sensors.forEach((sensorEntry) => {
//             const existingSensor = sensorMap.get(sensor_id);
//             // console.log(existingSensor)
//             if (existingSensor) {
//                 // Update indoor location and date of installation
//                 existingSensor.sensor.indoor_location = indoor_location;
//                 existingSensor.sensor.date_of_installation = date_of_installation;
//             }
//         });

//         // Save the updated warehouse data
//         await warehousedata.save();

//         res.status(200).send('Warehouse sensors updated successfully');
//     } catch (error) {
//         res.status(400).send(error);
//     }
// });





export default router