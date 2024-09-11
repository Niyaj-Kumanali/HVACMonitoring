import express from 'express';
import warehouse from '../schemas/warehouse_metadata.js';
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Warehouse:
 *       type: object
 *       required:
 *         - warehouse_id
 *         - warehouse_name
 *         - latitude
 *         - longitude
 *         - warehouse_dimensions
 *         - energy_resource
 *         - cooling_units
 *         - sensors
 *         - userId
 *         - email
 *       properties:
 *         warehouse_id:
 *           type: string
 *           description: Unique ID for the warehouse
 *         warehouse_name:
 *           type: string
 *           description: Name of the warehouse
 *         latitude:
 *           type: number
 *           description: Latitude coordinate
 *         longitude:
 *           type: number
 *           description: Longitude coordinate
 *         warehouse_dimensions:
 *           type: object
 *           properties:
 *             length:
 *               type: number
 *             width:
 *               type: number
 *             height:
 *               type: number
 *         energy_resource:
 *           type: string
 *           description: Type of energy resource used
 *         cooling_units:
 *           type: number
 *           description: Number of cooling units
 *         sensors:
 *           type: number
 *           description: Number of sensors
 *         userId:
 *           type: string
 *           description: User ID associated with the warehouse
 *         email:
 *           type: string
 *           description: Email of the user
 */

/**
 * @swagger
 * /warehouse/addwarehouse:
 *   post:
 *     summary: Create a new warehouse
 *     tags: [Warehouse]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Warehouse'
 *     responses:
 *       201:
 *         description: Warehouse created successfully
 *       400:
 *         description: Error creating warehouse
 *       409:
 *         description: Warehouse already exists
 */
router.post('/addwarehouse', async (req, res) => {
    try {
        const existingWarehouse = await warehouse.findOne({
            $or: [
                {warehouse_id: req.body.warehouse_id}

            ]
        });

        if (existingWarehouse) {
            return res.status(409).send({ message: 'Warehouse already exists' });
        }

        const newWarehouse = new warehouse(req.body);
        await newWarehouse.save();
        res.status(201).send(newWarehouse);
    } catch (error) {
        res.status(400).send(error);
    }
});

/**
 * @swagger
 * /warehouse/getallwarehouse:
 *   get:
 *     summary: Get all warehouses
 *     tags: [Warehouse]
 *     responses:
 *       200:
 *         description: A list of all warehouses
 *       500:
 *         description: Error retrieving warehouse data
 */
router.get('/getallwarehouse', async (req, res) => {
    try {
        const getAllWarehouse = await warehouse.find();

        if (!getAllWarehouse) {
            return res.status(404).json({ message: 'Warehouse not found' });
        }
        res.status(200).json(getAllWarehouse);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving warehouse data', error });
    }
});

/**
 * @swagger
 * /warehouse/getallwarehouse/{userId}:
 *   get:
 *     summary: Get all warehouses by user ID
 *     tags: [Warehouse]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID associated with the warehouses
 *     responses:
 *       200:
 *         description: A list of warehouses for the specified user
 *       404:
 *         description: Warehouse not found
 *       500:
 *         description: Error retrieving warehouse data
 */
// router.get('/getallwarehouse/:userId', async (req, res) => {
//     try {
//         const { userId } = req.params;
//         const getAllWarehouse = await warehouse.find({ userId });

//         if (getAllWarehouse.length === 0) {
//             return res.status(204).json({ statusText: 'Warehouse not found' });
//         }

//         res.status(200).json(getAllWarehouse);
//     } catch (error) {
//         res.status(500).json({ message: 'Error retrieving warehouse data', error });
//     }
// });

router.get('/getallwarehouse/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        // Get the page and pageSize from the query parameters, defaulting to 1 and 10 respectively
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;

        // Calculate the skip value (how many records to skip)
        const skip = (page - 1) * pageSize;

        // Get the total count of warehouses for the user (for pagination metadata)
        const total = await warehouse.countDocuments({ userId });

        // Get the paginated warehouses
        const getAllWarehouse = await warehouse.find({ userId })
            .skip(skip)
            .limit(pageSize);

        // Respond with an empty array if no warehouses are found
        if (getAllWarehouse.length === 0) {
            return res.status(200).json({
                warehouses: [],
                pagination: {
                    totalRecords: total,
                    currentPage: page,
                    totalPages: Math.ceil(total / pageSize),
                    pageSize: pageSize
                }
            });
        }

        // Respond with warehouses and pagination metadata
        res.status(200).json({
            warehouses: getAllWarehouse,
            pagination: {
                totalRecords: total,
                currentPage: page,
                totalPages: Math.ceil(total / pageSize),
                pageSize: pageSize
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving warehouse data', error });
    }
});



/**
 * @swagger
 * /warehouse/getwarehouse/{warehouse_id}:
 *   get:
 *     summary: Get warehouse by warehouse ID
 *     tags: [Warehouse]
 *     parameters:
 *       - in: path
 *         name: warehouse_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Warehouse ID
 *     responses:
 *       200:
 *         description: A warehouse object
 *       404:
 *         description: Warehouse not found
 *       500:
 *         description: Error retrieving warehouse data
 */
router.get('/getwarehouse/:warehouse_id', async (req, res) => {
    try {
        const { warehouse_id } = req.params;
        console.log(warehouse_id)
        const getWarehouse = await warehouse.findOne({ warehouse_id });

        if (!getWarehouse) {
            return res.status(404).json({ message: 'Warehouse not found' });
        }
        res.status(200).json(getWarehouse);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving warehouse data', error });
    }
});

/**
 * @swagger
 * /warehouse/deletewarehouse/{warehouse_id}:
 *   delete:
 *     summary: Delete a warehouse by warehouse ID
 *     tags: [Warehouse]
 *     parameters:
 *       - in: path
 *         name: warehouse_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Warehouse ID
 *     responses:
 *       200:
 *         description: Warehouse deleted successfully
 *       404:
 *         description: Warehouse not found
 *       500:
 *         description: Error deleting warehouse
 */
router.delete('/deletewarehouse/:warehouse_id', async (req, res) => {
    try {
        const { warehouse_id } = req.params;
        const result = await warehouse.findOneAndDelete({ warehouse_id });

        if (!result) {
            return res.status(204).send({ message: 'Warehouse not found' });
        }

        res.status(200).send({ message: 'Warehouse deleted successfully' });
    } catch (error) {
        res.status(500).send({ message: 'Error deleting warehouse', error });
    }
});



/**
 * @swagger
 * /warehouse/updatewarehouse/{warehouse_id}:
 *   put:
 *     summary: Update a warehouse by warehouse ID
 *     tags: [Warehouse]
 *     parameters:
 *       - in: path
 *         name: warehouse_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Warehouse ID
 *     responses:
 *       200:
 *         description: Warehouse Updated successfully
 *       404:
 *         description: Warehouse not found
 *       500:
 *         description: Error updating warehouse
 */
// Update a warehouse by warehouse_id
router.put('/updatewarehouse/:warehouse_id', async (req, res) => {
    try {
        const { warehouse_id } = req.params;
        const updateData = req.body;

        // Find the warehouse by warehouse_id and update it
        const updatedWarehouse = await warehouse.findOneAndUpdate(
            { warehouse_id },
            updateData,
            { new: true } // Return the updated document
        );

        if (!updatedWarehouse) {
            return res.status(204).json({ message: 'Warehouse not found' });
        }

        res.status(200).json(updatedWarehouse);
    } catch (error) {
        console.error("Error updating warehouse:", error);
        res.status(500).json({ message: 'Internal Server Error', error });
    }
});


export default router;
