import express from "express";
import {gridModel} from "../schemas/grid_metadata.js"

const router = express.Router();

router.post('/addgrid', async(req, res) => {
    try {
        const newgrid = new gridModel(req.body);
        await newgrid.save();
        res.status(201).send(newgrid);
    } catch (error) {
        res.status(500).send({message : "failed to add Grid", details : error.message})
    }
})

router.get('/getallgrids', async (req, res) => {
    try {
        const grids = await gridModel.find(); // Fetch all grids from the database
        if (!grids || grids.length === 0) {
            return res.status(404).json({ message: 'No grids found' });
        }
        res.status(200).json({
            message: 'Grids fetched successfully',
            grids
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch grids', details: error.message });
    }
});


export default router