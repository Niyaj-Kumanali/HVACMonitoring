import express from 'express';
import { roomModel } from '../schemas/room_metadata.js';
import warehouse from '../schemas/warehouse_metadata.js';

const router = express.Router();

router.post('/addroom', async (req, res) => {
    try {
        const body = req.body;  // Destructure room_name from the request body

        // Check if a room with the same name already exists
        console.log(body)
        const existingRoom = await roomModel.findOne({
            room_no: body.room_no
        });

        if (existingRoom) {
            return res.status(409).send({ message: 'Room no must be unique.' });
        }

        const newRoom = new roomModel(body);
        await newRoom.save();
        res.status(200).send(newRoom);
    } catch (error) {
        res.status(400).send({ error: "Failed to add room", details: error.message });
    }
});


router.get('/getallrooms', async (req, res) => {
    try {
        // Fetch all rooms from the database
        const rooms = await roomModel.find();

        // // Check if rooms are found
        // if (rooms.length === 0) {
        //     return res.status(404).json({ message: 'No rooms found.' });
        // }

        // Send the rooms in the response
        res.status(200).json(rooms);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch rooms', details: error.message });
    }
});

router.post('/getallrooms/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { warehouseId } = req.body;

        const rooms = []; // Initialize the rooms array

        // If a warehouseId is provided, fetch rooms assigned to that warehouse
        if (warehouseId) {
            const roomsAssigned = await roomModel.find({ userId: userId, warehouse_id: warehouseId });
            rooms.push(...roomsAssigned); // Use push to add roomsAssigned to rooms
        }

        // Fetch rooms not assigned to any warehouse
        const roomsNotAssigned = await roomModel.find({ userId: userId, warehouse_id: "" });
        rooms.push(...roomsNotAssigned); // Use push to add roomsNotAssigned to rooms

        // Send the rooms in the response
        res.status(200).json(rooms);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch rooms', details: error.message });
    }
});


router.put('/updatelevelslots/:roomId', async (req, res) => {
    try {
        const { roomId } = req.params;
        const { level_slot } = req.body;

        // Find the room by the roomId
        const roomToUpdate = await roomModel.findOne({ room_id: roomId });
        if (!roomToUpdate) {
            return res.status(404).send({ error: 'Room not found' });
        }

        const { racks, slot } = roomToUpdate;  // Get the number of racks and slots

        // Validate the level_slot input
        for (const [level, slots] of Object.entries(level_slot)) {
            const levelNumber = parseInt(level, 10);

            // Check if level exceeds the number of racks
            if (levelNumber > racks) {
                return res.status(400).send({
                    error: `Invalid level: ${levelNumber}. Maximum allowed level is ${racks}.`
                });
            }

            // Check if any slot in the array exceeds the number of available slots
            for (const slotNumber of slots) {
                if (slotNumber > slot) {
                    return res.status(400).send({
                        error: `Invalid slot number: ${slotNumber} for level ${levelNumber}. Maximum allowed slot is ${slot}.`
                    });
                }
            }
        }

        // If validation passes, update the level_slots
        roomToUpdate.level_slots = level_slot;

        // Save the updated room document
        await roomToUpdate.save();
        res.status(200).send(roomToUpdate);  // Return the updated room document

    } catch (error) {
        res.status(500).send({ error: 'Failed to update level slots', details: error.message });
    }
});

router.delete('/deleteroom/:roomId', async (req, res) => {
    const { roomId } = req.params;  // Extract roomId from the request body
    try {
        // Use findOneAndDelete with a query object
        const deletedRoom = await room.findOneAndDelete({ room_id: roomId });

        if (!deletedRoom) {
            return res.status(404).send({ error: "Room not found" });  // If no room found, return 404
        }

        res.status(200).send(deletedRoom);  // Send back the deleted room's details
    } catch (error) {
        res.status(500).send({ error: "Failed to delete room", details: error.message });  // Return 500 for server error
    }
});

router.get('/rooms/:warehouseId', async (req, res) => {
    const { warehouseId } = req.params;  // Extract warehouseId from the request parameters
    if (!warehouseId) {
        return res.status(400).json({ error: 'warehouseId is required' });
    }

    try {
        // Find all rooms associated with the given warehouseId
        const rooms = await roomModel.find({ warehouse_id: warehouseId });
        
        // Log the rooms for debugging
        console.log(rooms);
        
        // Respond with the retrieved rooms
        res.status(200).json(rooms);
    } catch (error) {
        console.error('Error retrieving rooms:', error.message);  // Log the error for debugging
        res.status(500).json({ error: 'Failed to retrieve rooms', details: error.message });  // Return 500 for server error
    }
});


router.put('/updaterooms', async (req, res) => {
    const { id, rooms } = req.body;
    // console.log(req.body)
    // Validate required fields
    if (!id || !rooms || rooms.length === 0) {
        return res.status(400).json({ error: 'Id and Room IDs are required' });
    }

    try {
        // Updating each room in the list
        rooms.map(async (roomId) => {
            const roomToUpdate = await roomModel.findOne({ room_id: roomId });
            if (!roomToUpdate) {
                console.warn(`Room not found for ID: ${roomId}`);
                return; // Skip to the next room if not found
            }
            roomToUpdate.warehouse_id = id;
            // console.log(roomToUpdate)
            roomToUpdate.save(); // Save the updated room
        });


        res.json({ message: 'Rooms updated successfully' });
    } catch (error) {
        console.error('Error executing query', error.stack);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



export default router;