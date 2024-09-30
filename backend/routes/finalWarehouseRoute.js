import express from 'express';
import finalwarehouse from '../schemas/finalWarehouse_metadata.js'; // Adjust the path as necessary
import { roomModel } from '../schemas/room_metadata.js';
import { powerswitchModel } from '../schemas/powerswitch_metadata.js';

const router = express.Router();

// Add Warehouse Endpoint
router.post('/addwarehouse', async (req, res) => {
    try {
        // Create a new warehouse instance using the request body
        const newWarehouse = new finalwarehouse(req.body);
        
        // Save the new warehouse to the database
        await newWarehouse.save();
        
        // Respond with the created warehouse
        res.status(201).send(newWarehouse);
    } catch (error) {
        // Handle validation or server errors
        res.status(400).send({ error: "Failed to add warehouse", details: error.message });
    }
});


router.get('/getwarehouses/:warehouse_id', async (req, res) => {
    try {
        const warehouse = await finalwarehouse.findOne({ warehouse_id: req.params.warehouse_id });

        if (!warehouse) {
            return res.status(404).json({ message: 'Warehouse not found' });
        }

        console.log({ warehouse_id: warehouse });

        // Check if rooms array exists and is not empty
        let roomsWithDetails = [];
        if (Array.isArray(warehouse.rooms) && warehouse.rooms.length > 0) {
            // Populate room data using the room_id
            roomsWithDetails = await Promise.all(
                warehouse.rooms.map(async (room) => {
                    console.log({ rooms: room });
                    const roomData = await roomModel.findOne({ room_id: room }).select('room_name racks power_point slot level_slots room_id');
                    return roomData; // Return the room details directly
                })
            );
        }

        let powerStatusWithDetails = [];
        if (Array.isArray(warehouse.powerSource) && warehouse.powerSource.length > 0) {
            //populate power source using powerSource_id
            powerStatusWithDetails = await Promise.all(
                warehouse.powerSource.map(async (power) => {
                    console.log({power : power});
                    const powerDetails = await powerswitchModel.findOne({powerSource_id : power}).select('powerSource_id powerSource_status power_source')
                    return powerDetails;
                })
            )
        }


        const { rooms, ...warehouseWithoutRooms } = warehouse.toObject();

        return res.status(200).json({   
            message: 'Warehouse and room details fetched successfully',
            warehouse : warehouseWithoutRooms,
            rooms: roomsWithDetails,
            powerStatus : powerStatusWithDetails
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error', error });
    }
});


export default router;
