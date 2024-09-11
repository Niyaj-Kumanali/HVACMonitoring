import express from 'express';
import Dashboards from '../schemas/dashboards_metadata.js'; // Ensure path is correct
const router = express.Router();

router.post("/addwidget/:dashboardId", async (req, res) => {
    try {
        const { dashboardId } = req.params;
        const body = req.body;  // Assuming the body follows the DashboardLayoutOptions structure

        // Check if a dashboard with the given dashboardId already exists
        const existingDashboard = await Dashboards.findOne({ dashboardId });

        if (existingDashboard) {
            // If the dashboard exists, update its layoutOptions
            await Dashboards.updateOne(
                { dashboardId },
                { $set: { layoutOptions: body, updatedAt: Date.now() } }  // Update layoutOptions and timestamp
            );
            res.status(200).json({ message: 'Dashboard layouts updated successfully' });
        } else {
            // If the dashboard doesn't exist, create a new one with the layoutOptions
            const newDashboard = new Dashboards({ dashboardId, layoutOptions: body });
            await newDashboard.save();
            res.status(201).json({ message: 'New dashboard and layouts created successfully' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error processing request', error });
    }
});


router.get("/getwidget/:dashboardId", async (req, res) => {
    try {
        const { dashboardId } = req.params;

        // Find the dashboard by dashboardId
        const dashboard = await Dashboards.findOne({ dashboardId });

        if (dashboard) {
            // If found, return the layoutOptions
            res.status(200).json(dashboard.layoutOptions);
        } else {
            // If not found, return a 404 status
            res.status(404).json({ message: 'Dashboard not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching the dashboard', error });
    }
});

export default router;
