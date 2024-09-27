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


export default router