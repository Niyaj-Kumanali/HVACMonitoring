import express from 'express';
import vehicle from '../schemas/vehicle_metadata.js'; // Ensure the path and extension are correct

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Vehicle:
 *       type: object
 *       required:
 *         - vehicle_id
 *         - vehicle_number
 *         - userId
 *       properties:
 *         vehicle_id:
 *           type: string
 *           description: Unique ID for the vehicle
 *         vehicle_number:
 *           type: string
 *           description: Number of the vehicle
 *         userId:
 *           type: string
 *           description: User ID associated with the vehicle
 *         cooling_units:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               coolant:
 *                 type: string
 *                 description: ID of the associated coolant
 *         sensors:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               sensor:
 *                 type: string
 *                 description: ID of the associated sensor
 */

/**
 * @swagger
 * /vehicle/addvehicle:
 *   post:
 *     summary: Create a new vehicle
 *     tags: [Vehicle]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Vehicle'
 *     responses:
 *       201:
 *         description: Vehicle created successfully
 *       400:
 *         description: Error creating vehicle
 *       409:
 *         description: Vehicle already exists
 */
router.post('/addvehicle', async (req, res) => {
  try {
    const existingVehicle = await vehicle.findOne({
      $or: [
        { vehicle_id: req.body.vehicle_id },
        { vehicle_number: req.body.vehicle_number },
      ],
    });

    if (existingVehicle) {
      return res.status(409).send({ message: 'Vehicle already exists' });
    }

    const newvehicle = new vehicle(req.body);
    await newvehicle.save();
    res.status(201).send(newvehicle);
  } catch (error) {
    res.status(400).send(error);
  }
});

/**
 * @swagger
 * /vehicle/getallvehicle:
 *   get:
 *     summary: Get all vehicles
 *     tags: [Vehicle]
 *     responses:
 *       200:
 *         description: A list of all vehicles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Vehicle'
 *       404:
 *         description: Vehicles not found
 *       400:
 *         description: Error retrieving vehicles
 */
router.get('/getallvehicle', async (req, res) => {
  try {
    const getallvehicle = await vehicle.find();

    if (!getallvehicle) {
      return res.status(404).json({ message: 'Vehicles not found' });
    }
    res.status(200).json(getallvehicle);
  } catch (error) {
    res.status(400).send(error);
  }
});

/**
 * @swagger
 * /vehicle/getallvehicle/{userId}:
 *   get:
 *     summary: Get all vehicles by user ID
 *     tags: [Vehicle]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID associated with the vehicles
 *     responses:
 *       200:
 *         description: A list of vehicles for the specified user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Vehicle'
 *       204:
 *         description: No vehicles found for the current userId
 *       500:
 *         description: Error retrieving vehicles
 */
// router.get('/getallvehicle/:userId', async (req, res) => {
//     try {
//         const { userId } = req.params;
//         const getallvehicle = await vehicle.find({ userId });

//         if (getallvehicle.length === 0) {
//             return res.status(204).json({ message: 'No vehicles found for the current userId' });
//         }

//         res.status(200).json(getallvehicle);
//     } catch (error) {
//         res.status(500).json({ message: 'Error retrieving vehicle data', error });
//     }
// });
router.get('/getallvehicle/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Get the page and pageSize from the request body, defaulting to 0 and 12 respectively
    const page = parseInt(req.query.page) || 0;
    const pageSize = parseInt(req.query.pageSize) ||  12;

    // Calculate the skip value (how many records to skip)
    const skip = page * pageSize;

    // Get the total count of vehicles for the user (for pagination metadata)
    const totalElements = await vehicle.countDocuments({ userId });

    // Calculate totalPages and check if the requested page is out of range
    const totalPages = Math.ceil(totalElements / pageSize);

    // If the requested page is out of range, return empty data
    if (page >= totalPages) {
      return res.status(200).json({
        data: [],
        hasNext: false,
        totalElements,
        totalPages
      });
    }

    // Get the paginated vehicles
    const getAllVehicle = await vehicle
      .find({ userId })
      .skip(skip)
      .limit(pageSize);

    // Check if there is a next page
    const hasNext = page < totalPages - 1;

    // Respond with vehicles, pagination metadata, and hasNext flag
    res.status(200).json({
      data: getAllVehicle,
      hasNext,
      totalElements,
      totalPages
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving vehicle data', error });
  }
});


/**
 * @swagger
 * /vehicle/getbyvehicleid/{vehicle_id}:
 *   get:
 *     summary: Get vehicle by vehicle ID
 *     tags: [Vehicle]
 *     parameters:
 *       - in: path
 *         name: vehicle_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Vehicle ID
 *     responses:
 *       200:
 *         description: Vehicle data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vehicle'
 *       404:
 *         description: Vehicle not found
 *       500:
 *         description: Internal Server Error
 */
router.get('/getbyvehicleid/:vehicle_id', async (req, res) => {
  try {
    const { vehicle_id } = req.params;
    const vehicleData = await vehicle
      .findOne({ vehicle_id })
      .populate({
        path: 'cooling_units.coolant',
        select: 'coolant_id location_in vehicle',
      })
      .populate({
        path: 'sensors.sensor',
        select: 'sensor_id indoor_location Type date_of_installation',
      })
      .exec();

    if (!vehicleData) {
      return res.status(204).json({ message: 'Vehicle not found' });
    }

    res.json(vehicleData);
  } catch (error) {
    console.error('Error fetching vehicle:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

/**
 * @swagger
 * /vehicle/deletevehicle/{vehicle_id}:
 *   delete:
 *     summary: Delete a vehicle by vehicle ID
 *     tags: [Vehicle]
 *     parameters:
 *       - in: path
 *         name: vehicle_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Vehicle ID
 *     responses:
 *       200:
 *         description: Vehicle deleted successfully
 *       404:
 *         description: Vehicle not found
 *       400:
 *         description: Error deleting vehicle
 */
router.delete('/deletevehicle/:vehicle_id', async (req, res) => {
  try {
    const { vehicle_id } = req.params;

    const result = await vehicle.findOneAndDelete({ vehicle_id });

    if (!result) {
      return res.status(204).send({ message: 'Vehicle not found' });
    }
    res.status(200).send({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    res.status(400).send(error);
  }
});

/**
 * @swagger
 * /vehicle/updatevehicle/{vehicle_id}:
 *   put:
 *     summary: Update a vehicle by vehicle ID
 *     tags:
 *       - Vehicle
 *     parameters:
 *       - in: path
 *         name: vehicle_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Vehicle ID
 *     responses:
 *       200:
 *         description: Vehicle updated successfully
 *       404:
 *         description: Vehicle not found
 *       500:
 *         description: Error updating vehicle
 */

// Update a vehicle by vehicle_id
router.put('/updatevehicle/:vehicle_id', async (req, res) => {
  try {
    const { vehicle_id } = req.params;
    const updateData = req.body;

    // Find the vehicle by vehicle_id and update it
    const updatedVehicle = await vehicle.findOneAndUpdate(
      { vehicle_id },
      updateData,
      { new: true } // Return the updated document
    );

    if (!updatedVehicle) {
      return res.status(204).json({ message: 'vehicle not found' });
    }

    res.status(200).json(updatedVehicle);
  } catch (error) {
    console.error('Error updating vehicle:', error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
});

export default router;
