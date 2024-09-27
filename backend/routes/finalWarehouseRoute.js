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


router.get('/Warehouses/:warehouse_id', async (req, res) => {
    try {
        const warehouse = await finalwarehouse.findOne({ warehouse_id: req.params.warehouse_id });

        if (!warehouse) {
            return res.status(404).json({ message: 'Warehouse not found' });
        }

        console.log(warehouse);

        // Populate room data using the room_id
        const roomsWithDetails = await Promise.all(
            warehouse.rooms.map(async (room) => {
                console.log(room)
                const roomData = await roomModel.findOne({ room_id: room }).select('room_name racks power_point slot level_slots');
                return {
                    details: roomData // Attach the populated room details
                };
            })
        );

        const powerSourceDetails = await Promise.all(
            await powerswitchModel.findOne({})
        )

        // Respond with warehouse data and populated room details
        res.json({ ...warehouse.toObject(), rooms: roomsWithDetails });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


export default router;
