import express from "express";
import {gridModel} from "../schemas/grid_metadata.js"

const router = express.Router();

router.post('/addgrid', async(req, res) => {
    try {
        const newgrid = new gridModel(req.body);
        await newgrid.save();
        res.status(200).send(newgrid);
    } catch (error) {
        res.status(500).send({message : "failed to add Grid", details : error.message})
    }
})

router.get('/getallgrids', async (req, res) => {
    try {
        const grids = await gridModel.find(); 
        if (!grids || grids.length === 0) {
            return res.status(404).json({ message: 'No grids found' });
        }
        res.status(200).json(grids);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch grids', details: error.message });
    }
});

router.get('/getgrid/:grid_id', async (req, res) => {
    const { grid_id } = req.params;

    try {
        const grid = await gridModel.findOne({ grid_id }); 

        if (!grid) {
            return res.status(404).json({ message: 'Grid not found' });
        }

        res.status(200).json(grid);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch grid', details: error.message });
    }
});

router.put('/updategrid/:grid_id', async (req, res) => {
    const { grid_id } = req.params;

    try {
        const updatedGrid = await gridModel.findOneAndUpdate(
            { grid_id }, 
            req.body,   
            { new: true } 
        );

        if (!updatedGrid) {
            return res.status(404).json({ message: 'Grid not found' });
        }

        res.status(200).json(updatedGrid);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update grid', details: error.message });
    }
});

router.put('/updategrids', async (req, res) => {
    const { id, grids} = req.body;
    console.log(id, grids)

    if (!id || !grids || grids.length === 0) {
        return res.status(400).json({ error: 'Id and grid IDs are required' });
    }
    console.log(req.body)

    try {
        grids.map(async (gridId) => {
            console.log(gridId)
            const gridToUpdate = await gridModel.findOne({grid_id : gridId})
            if (!gridToUpdate){
                console.warn(`grid not found for ID: ${gridId}`);
                return;
            }

            gridToUpdate.warehouse_id = id;
            gridToUpdate.save();
        })
        res.json({ message: 'Grid updated successfully' });
    } catch (error) {
        console.error(error.stack);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})


router.delete('/deletegrid/:grid_id', async (req, res) => {
    const { grid_id } = req.params;

    try {
        const deletedGrid = await gridModel.findOneAndDelete({ grid_id });

        if (!deletedGrid) {
            return res.status(404).json({ message: 'Grid not found' });
        }

        res.status(200).json({
            message: `Grid deleted succesfully ${deletedGrid.grid_id}`,
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete grid', details: error.message });
    }
});



export default router