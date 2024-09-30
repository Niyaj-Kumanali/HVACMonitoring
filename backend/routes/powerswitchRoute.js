import express from "express";
import { powerswitchModel } from "../schemas/powerswitch_metadata.js"; 
import { dgsetModel } from "../schemas/dgset_meatadata.js";  
import { gridModel } from "../schemas/grid_metadata.js";   

const router = express.Router();

router.post("/addpowerswitch", async (req, res) => {
    const { powerSource_status, powerSource_id, dgset_id, grid_id } = req.body;
    try {
        let powerSource;

        // Check if the power source is valid
        if (powerSource_status === true) {
            // If powerSource_status is ON, use the DGSet as the power source
            const dgset = await dgsetModel.findOne({ dgset_id: dgset_id });
            if (!dgset) {
                return res.status(404).json({ message: "DGSet not found" });
            }
            powerSource = dgset;
        } else if (powerSource_status === false) {
            // If powerSource_status is OFF, use the Grid as the power source
            const grid = await gridModel.findOne({ grid_id: grid_id });
            if (!grid) {
                return res.status(404).json({ message: "Grid not found" });
            }
            powerSource = grid;
        } else {
            return res.status(400).json({ message: "Invalid powerSource_status value. Should be true (ON) or false (OFF)." });
        }

        // Create a new power switch
        const newPowerSwitch = new powerswitchModel({
            powerSource_id,
            powerSource_status,
            power_source: powerSource,
            dgset: powerSource_status ? dgset_id : null,
            grid: !powerSource_status ? grid_id : null,
        });

        // Save the new power switch to the database
        await newPowerSwitch.save();

        return res.status(201).json({
            message: "Power switch created successfully",
            power_switch: {
                powerSource_id: newPowerSwitch.powerSource_id,
                powerSource_status: powerSource_status ? "ON" : "OFF",
                dgset: powerSource_status ? dgset_id : null,
                grid: !powerSource_status ? grid_id : null,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error", error });
    }
});


// Update Power Switch
router.put("/updateswitch", async (req, res) => {
    const { powerSource_status, powerSource_id, dgset_id, grid_id } = req.body;
    try {
        let powerSource;

        if (powerSource_status === true) {
            // If powerSource_status is ON, set dgset as the power source
            const dgset = await dgsetModel.findOne({ dgset_id: dgset_id }); // Find by dgset_id
            if (!dgset) {
                return res.status(404).json({ message: "DGSet not found" });
            }
            powerSource = dgset;
        } else if (powerSource_status === false) {
            // If powerSource_status is OFF, set grid as the power source
            const grid = await gridModel.findOne({ grid_id: grid_id }); // Find by grid_id
            if (!grid) {
                return res.status(404).json({ message: "Grid not found" });
            }
            powerSource = grid;
        } else {
            return res.status(400).json({ message: "Invalid powerSource_status value. Should be true (ON) or false (OFF)." });
        }

        // Find and update the power switch entry
        const updatedPowerSwitch = await powerswitchModel.findOneAndUpdate(
            { powerSource_id }, // Example: { grid: grid_id }
            {
                powerSource_status,
                power_source: powerSource,
                dgset: powerSource_status ? powerSource.dgset_id : null,
                grid: !powerSource_status ? powerSource.grid_id : null
            },
            { new: true, upsert: true } // `upsert: true` creates the document if it doesn't exist
        );

        // Check if the power switch was updated or created
        if (!updatedPowerSwitch) {
            return res.status(404).json({ message: "Power switch not found or created." });
        }

        const { position,dgset,grid, ...responsePayload } = updatedPowerSwitch._doc;

        return res.status(200).json({
            message: "Power switch updated successfully",
            power_switch: {
                ...responsePayload,
                powerSource_status: powerSource_status ? "ON" : "OFF", // Correctly set powerSource_status
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
});

export default router;
