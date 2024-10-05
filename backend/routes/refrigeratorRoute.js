import express from 'express';
import { refrigeratorModel } from '../schemas/refrigerator_metadata.js';
const router = express.Router();

router.post('/addrefrigerator', async (req, res) => {
    try {
        const body = req.body;  // Destructure room_name from the request body

        const newRefrigerator = new refrigeratorModel(body);
        await newRefrigerator.save();
        res.status(200).send(newRefrigerator);
    } catch (error) {
        res.status(400).send({ error: "Failed to add Refrigerator", details: error.message });
    }
});

router.get('/getallrefrigerator', async (req, res) => {
    try {
        const allRefrigerators = await refrigeratorModel.find({});
        res.status(200).json(allRefrigerators);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve refrigerators", details: error.message });
    }
});


router.post('/getallrefrigerator/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { warehouseId } = req.body;

        const userRefrigerators = []; // Initialize the rooms array

        // If a warehouseId is provided, fetch rooms assigned to that warehouse
        if (warehouseId) {
            const assigned = await refrigeratorModel.find({ userId: userId, warehouse_id: warehouseId });
            userRefrigerators.push(...assigned); // Use push to add roomsAssigned to rooms
        }

        // Fetch rooms not assigned to any warehouse
        const notAssigned = await refrigeratorModel.find({ userId: userId, warehouse_id: "" });
        userRefrigerators.push(...notAssigned); // Use push to add roomsNotAssigned to rooms

        res.status(200).json(userRefrigerators);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve user's refrigerators", details: error.message });
    }
});

router.get('/getallrefrigerator/:userId/:warehouse_id', async (req, res) => {
    try {
        const { userId, warehouse_id } = req.params;
        const warehouseRefrigerators = await refrigeratorModel.find({ userId, warehouse_id });
        if (warehouseRefrigerators.length === 0) {
            return res.status(404).json({ message: 'No refrigerators found for this user in the specified warehouse' });
        }
        res.status(200).json(warehouseRefrigerators);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve refrigerators for specified user and warehouse", details: error.message });
    }
});

router.get('/getrefrigerator/:refrigerator_id', async (req, res) => {
    try {
        const { refrigerator_id } = req.params;
        const refrigerator = await refrigeratorModel.findOne({ refrigerator_id });
        if (!refrigerator) {
            return res.status(404).json({ message: 'Refrigerator not found' });
        }
        res.status(200).json(refrigerator);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve refrigerator", details: error.message });
    }
});

router.put('/updaterefrigerator/:refrigerator_id', async (req, res) => {
    try {
        const { refrigerator_id } = req.params;
        const updatedRefrigerator = await refrigeratorModel.findOneAndUpdate(
            { refrigerator_id },
            req.body,
            { new: true } // Return the updated document
        );
        if (!updatedRefrigerator) {
            return res.status(404).json({ message: 'Refrigerator not found for update' });
        }
        res.status(200).json(updatedRefrigerator);
    } catch (error) {
        res.status(400).json({ error: "Failed to update refrigerator", details: error.message });
    }
});

router.post('/updaterefrigerators', async (req, res) => {
    const { id, refrigerators} = req.body;
    // console.log("refs", id, refrigerators);


    try {
        refrigerators.map(async (refrigeratorId) => {
            const refrigeratorToUpdate = await refrigeratorModel.findOne({refrigerator_id : refrigeratorId})
            if (!refrigeratorToUpdate){
                console.warn(`refrigerator not found for ID: ${refrigeratorId}`);
                return;
            }

            refrigeratorToUpdate.warehouse_id = id;
            refrigeratorToUpdate.save();
        })
        res.json({ message: 'Refrigerator updated successfully' });
    } catch (error) {
        console.error(error.stack);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

router.delete('/delleterefrigerator/:refrigerator_id', async (req, res) => {
    try {
        const { refrigerator_id } = req.params;
        const deletedRefrigerator = await refrigeratorModel.findOneAndDelete({ refrigerator_id });
        if (!deletedRefrigerator) {
            return res.status(404).json({ message: 'Refrigerator not found for deletion' });
        }
        res.status(200).json({ message: 'Refrigerator deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete refrigerator", details: error.message });
    }
});

export default router;