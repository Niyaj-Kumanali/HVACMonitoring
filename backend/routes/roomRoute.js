import express from 'express';
import { roomModel } from '../schemas/room_metadata.js';
const router = express.Router();

router.post('/addroom', async (req, res) => {
    try {
        const body = req.body;  // Destructure room_name from the request body

        // Check if a room with the same name already exists
        const existingRoom = await roomModel.findOne({
            room_name: body.room_name
        });

        if (existingRoom) {
            return res.status(409).send({ message: 'Room name must be unique.' });
        }

        const newRoom = new roomModel(body);
        await newRoom.save();
        res.status(200).send(newRoom);
    } catch (error) {
        res.status(400).send({ error: "Failed to add room", details: error.message });
    }
});


router.put('/updatelevelslots', async (req, res) => {
    try {
        const { roomId, level_slot } = req.body;

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


export default router;