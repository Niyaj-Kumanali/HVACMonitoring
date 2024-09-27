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

export default router