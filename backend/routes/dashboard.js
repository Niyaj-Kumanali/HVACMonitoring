import express from 'express';
import Dashboards from '../schemas/dashboards_metadata.js'; // Ensure path is correct
const router = express.Router();


/**
 * @swagger
 * /addwidget/{dashboardId}:
 *   post:
 *     summary: Add or update widget layout for a dashboard
 *     tags: [Dashboards]
 *     description: Adds or updates the layout options for a dashboard identified by the `dashboardId`. If the dashboard exists, its layout options are updated; if not, a new dashboard is created with the given layout options.
 *     parameters:
 *       - in: path
 *         name: dashboardId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the dashboard to add or update the widget layout for.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               layoutOptions:
 *                 type: object
 *                 description: The layout options for the dashboard.
 *                 example:
 *                   widgets: [
 *                     {
 *                       id: "widget1",
 *                       type: "chart",
 *                       position: { x: 0, y: 0, w: 6, h: 4 }
 *                     },
 *                     {
 *                       id: "widget2",
 *                       type: "table",
 *                       position: { x: 6, y: 0, w: 6, h: 4 }
 *                     }
 *                   ]
 *     responses:
 *       200:
 *         description: Dashboard layouts updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Dashboard layouts updated successfully
 *       201:
 *         description: New dashboard and layouts created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: New dashboard and layouts created successfully
 *       500:
 *         description: Error processing request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error processing request
 *                 error:
 *                   type: string
 *                   example: Detailed error message
 */
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


/**
 * @swagger
 * /getwidget/{dashboardId}:
 *   get:
 *     summary: Retrieve widget layout for a dashboard
 *     tags: [Dashboards]
 *     description: Retrieves the layout options for a dashboard identified by the `dashboardId`. Returns the layout options if found, otherwise returns a 404 status.
 *     parameters:
 *       - in: path
 *         name: dashboardId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the dashboard to retrieve the widget layout for.
 *     responses:
 *       200:
 *         description: Successfully retrieved the dashboard layout options.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 layoutOptions:
 *                   type: object
 *                   description: The layout options for the dashboard.
 *                   example:
 *                     widgets: [
 *                       {
 *                         id: "widget1",
 *                         type: "chart",
 *                         position: { x: 0, y: 0, w: 6, h: 4 }
 *                       },
 *                       {
 *                         id: "widget2",
 *                         type: "table",
 *                         position: { x: 6, y: 0, w: 6, h: 4 }
 *                       }
 *                     ]
 *       404:
 *         description: Dashboard not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Dashboard not found
 *       500:
 *         description: Error fetching the dashboard.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error fetching the dashboard
 *                 error:
 *                   type: string
 *                   example: Detailed error message
 */
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
