import express from 'express';
import coolant from '../schemas/coolant_metadata.js'; // Ensure to use the .js extension or adjust based on your file structure
import warehouse from '../schemas/warehouse_metadata.js'; // Ensure to use the .js extension or adjust based on your file structure

const router = express.Router();

// create a new coolant
router.post('/addcoolant', async(req, res) =>{
    try {

        const existingCoolant = await coolant.findOne({
            coolant_id: req.body.coolant_id
        });

        if(existingCoolant){
            return res.status(409).send({message: "Coolant already exists"})
        }

        const newcoolant = new coolant(req.body);
        await newcoolant.save();
        res.status(201).send(newcoolant);
    } catch (error) {
        res.status(400).send(error);
    }
});

// get all coolants
router.get('/getallcoolants', async(req, res) => {
    try {
        const allcoolants = await coolant.find();
        res.status(201).json(allcoolants);
    } catch (error) {
        res.status(400).send(error);
    }
});

//get cooland by id
router.get('/getcoolant/:coolant_id', async (req, res) => {
    try {
        const { coolant_id } = req.params;

        // Find the coolant by coolant_id
        const getcoolant = await coolant.findOne({ coolant_id });

        // Check if the coolant was found
        if (!getcoolant) {
            return res.status(404).json({ message: 'Coolant not found' });
        }

        // Respond with the found coolant
        res.status(200).json(getcoolant);
    } catch (error) {
        console.error('Error retrieving coolant:', error);
        res.status(400).send(error.message);
    }
});


// get avaliable sensors, which are not in use
// router.get('/getavaliablecoolants', async(req, res) => {
//     try {
//         const allcoolants = await coolant.find();
        
//         const allwarehouse = await warehouse.find()
//         .populate({
//             path: 'cooling_units.coolant',
//             select: 'coolant_id'
//         })
//         .exec();

//         const usedCoolantsIds = new Set();
//         allwarehouse.forEach(warehouse => {
//             warehouse.cooling_units.forEach(unit => {
//                 // console.log(unit.coolant.coolant_id)
//                 if(unit.coolant && unit.coolant.coolant_id) {
//                     usedCoolantsIds.add(unit.coolant.coolant_id)
//                 }
//             })
//         })

//         const avaliableCoolants = allcoolants.filter(coolant => !usedCoolantsIds.has(coolant.coolant_id))

//         res.status(200).json(avaliableCoolants);

//     } catch (error) {
//         res.status(400).send({ message: 'Error retrieving available coolants', error });
//     }
// });

export default router