import express from "express";
import {dgsetModel} from '../schemas/dgset_meatadata.js'


const router = express.Router();

router.post('/adddgset', async(req, res) => {

    try {
        const newdgset = new dgsetModel(req.body)
        await newdgset.save();
        res.status(200).send(newdgset);
    } catch (error) {
        res.send(500).send({message: "failed to add DGSet ", details: error.message})
    }

})

router.get('/getalldgsets', async (req, res) => {
    try {
        const dgsets = await dgsetModel.find(); // Fetch all DGSet entries from the database
        if (!dgsets || dgsets.length === 0) {
            return res.status(404).json({ message: 'No DGSets found' });
        }
        res.status(200).json({
            message: 'DGSets fetched successfully',
            dgsets
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch DGSets', details: error.message });
    }
});


router.put('/updatedgset/:dgset_id', async (req, res) => {
    const { dgset_id } = req.params;
    
    try {
        const updatedDgset = await dgsetModel.findOneAndUpdate(
            { dgset_id }, 
            req.body,   
            { new: true }
        );

        if (!updatedDgset) {
            return res.status(404).json({ message: 'DGSet not found' });
        }

        return res.status(200).json({
            message: 'DGSet updated successfully',
            dgset: updatedDgset
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error', error });
    }
});


router.delete('/deletedgset/:dgset_id', async (req, res) => {
    const { dgset_id } = req.params;  // Get the dgset_id from the request parameters
    
    try {
        // Find and delete the dgset by its ID
        const deletedDgset = await dgsetModel.findOneAndDelete({ dgset_id });
        
        if (!deletedDgset) {
            return res.status(404).json({ message: 'DGSet not found' });
        }

        return res.status(200).json({
            message: 'DGSet deleted successfully',
            dgset: deletedDgset
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error', error });
    }
});



export default router