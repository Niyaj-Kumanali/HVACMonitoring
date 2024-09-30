import express from "express";
import { powerswitchModel } from "../schemas/powerswitch_metadata.js"; 
import { dgsetModel } from "../schemas/dgset_meatadata.js";  
import { gridModel } from "../schemas/grid_metadata.js";   

const router = express.Router();

// Create a new Power Switch
router.post("/addpowerswitch", async (req, res) => {
    const { powerSource_status, powerSource_id, dgset_id, grid_id } = req.body;
    try {
        let powerSource;

        // Determine the power source based on powerSource_status (true = DGSet, false = Grid)
        if (powerSource_status === true) {
            const dgset = await dgsetModel.findOne({ dgset_id: dgset_id });
            if (!dgset) {
                return res.status(404).json({ message: "DGSet not found" });
            }
            powerSource = dgset;
        } else if (powerSource_status === false) {
            const grid = await gridModel.findOne({ grid_id: grid_id });
            if (!grid) {
                return res.status(404).json({ message: "Grid not found" });
            }
            powerSource = grid;
        } else {
            return res.status(400).json({ message: "Invalid powerSource_status value. Should be true (ON) or false (OFF)." });
        }

        // Create a new power switch entry
        const newPowerSwitch = new powerswitchModel({
            powerSource_id,
            powerSource_status,
            power_source: powerSource, // Storing the entire DGSet/Grid object
            dgset: powerSource_status ? dgset_id : null,
            grid: !powerSource_status ? grid_id : null,
        });

        await newPowerSwitch.save();

        // Return the newly created power switch details
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

// Get all Power Switches
router.get('/getallpowerswitches', async (req, res) => {
    try {
        const powerSwitches = await powerswitchModel.find(); // Fetch all power switches from the database

        if (!powerSwitches || powerSwitches.length === 0) {
            return res.status(404).json({ message: 'No power switches found' });
        }

        // Fetch the full DGSet or Grid object for each power switch if it's not already stored
        const updatedPowerSwitches = await Promise.all(
            powerSwitches.map(async (powerSwitch) => {
                let powerSource = powerSwitch.power_source;

                // If powerSource is stored as an ID, fetch the corresponding DGSet or Grid object
                if (typeof powerSource === "string") {
                    if (powerSwitch.powerSource_status === true) {
                        // Fetch DGSet if powerSource_status is true (ON)
                        powerSource = await dgsetModel.findOne({ dgset_id: powerSwitch.power_source });
                    } else if (powerSwitch.powerSource_status === false) {
                        // Fetch Grid if powerSource_status is false (OFF)
                        powerSource = await gridModel.findOne({ grid_id: powerSwitch.power_source });
                    }
                }

                // Return the updated power switch with the full powerSource object
                return {
                    ...powerSwitch._doc,
                    power_source: powerSource, // Ensure power_source is an object
                };
            })
        );

        res.status(200).json({
            message: 'Power switches fetched successfully',
            powerSwitches: updatedPowerSwitches
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch power switches', details: error.message });
    }
});


// Get a specific Power Switch by powerSource_id
router.get('/getpowerswitch/:powerSource_id', async (req, res) => {
    const { powerSource_id } = req.params;
    try {
        const powerSwitch = await powerswitchModel.findOne({ powerSource_id });
        if (!powerSwitch) {
            return res.status(404).json({ message: 'Power switch not found' });
        }
        res.status(200).json({
            message: 'Power switch fetched successfully',
            powerSwitch
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch power switch', details: error.message });
    }
});

// Update a Power Switch
router.put("/updateswitch", async (req, res) => {
    const { powerSource_status, powerSource_id, dgset_id, grid_id } = req.body;
    try {
        let powerSource;

        // Determine the power source based on the updated powerSource_status
        if (powerSource_status === true) {
            const dgset = await dgsetModel.findOne({ dgset_id: dgset_id });
            if (!dgset) {
                return res.status(404).json({ message: "DGSet not found" });
            }
            powerSource = dgset;
        } else if (powerSource_status === false) {
            const grid = await gridModel.findOne({ grid_id: grid_id });
            if (!grid) {
                return res.status(404).json({ message: "Grid not found" });
            }
            powerSource = grid;
        } else {
            return res.status(400).json({ message: "Invalid powerSource_status value. Should be true (ON) or false (OFF)." });
        }

        // Update the power switch entry
        const updatedPowerSwitch = await powerswitchModel.findOneAndUpdate(
            { powerSource_id }, 
            {
                powerSource_status,
                power_source: powerSource, // Storing the entire DGSet/Grid object
                dgset: powerSource_status ? powerSource.dgset_id : null,
                grid: !powerSource_status ? powerSource.grid_id : null
            },
            { new: true, upsert: true } // Creates the document if it doesn't exist
        );

        if (!updatedPowerSwitch) {
            return res.status(404).json({ message: "Power switch not found or created." });
        }

        const { dgset, grid, ...responsePayload } = updatedPowerSwitch._doc;

        return res.status(200).json({
            message: "Power switch updated successfully",
            power_switch: {
                ...responsePayload,
                powerSource_status: powerSource_status ? "ON" : "OFF", // Human-readable status
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
});

// Delete a Power Switch
router.put("/updateswitch/:powerSource_id", async (req, res) => {
    const { powerSource_status, dgset_id, grid_id } = req.body;
    const { powerSource_id } = req.params; // Extracting powerSource_id from the URL parameters

    try {
        let powerSource;

        // Determine the power source based on the updated powerSource_status
        if (powerSource_status === true) {
            const dgset = await dgsetModel.findOne({ dgset_id: dgset_id });
            if (!dgset) {
                return res.status(404).json({ message: "DGSet not found" });
            }
            powerSource = dgset;
        } else if (powerSource_status === false) {
            const grid = await gridModel.findOne({ grid_id: grid_id });
            if (!grid) {
                return res.status(404).json({ message: "Grid not found" });
            }
            powerSource = grid;
        } else {
            return res.status(400).json({ message: "Invalid powerSource_status value. Should be true (ON) or false (OFF)." });
        }

        // Update the power switch entry
        const updatedPowerSwitch = await powerswitchModel.findOneAndUpdate(
            { powerSource_id }, 
            {
                powerSource_status,
                power_source: powerSource, // Storing the entire DGSet/Grid object
                dgset: powerSource_status ? powerSource.dgset_id : null,
                grid: !powerSource_status ? powerSource.grid_id : null
            },
            { new: true, upsert: true } // Creates the document if it doesn't exist
        );

        if (!updatedPowerSwitch) {
            return res.status(404).json({ message: "Power switch not found or created." });
        }

        // Extract the unnecessary fields and return the response
        const { dgset, grid, ...responsePayload } = updatedPowerSwitch._doc;

        return res.status(200).json({
            message: "Power switch updated successfully",
            power_switch: {
                ...responsePayload,
                powerSource_status: powerSource_status ? "ON" : "OFF", // Human-readable status
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
});


export default router;
