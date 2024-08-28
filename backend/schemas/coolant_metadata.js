import mongoose from 'mongoose';
import { type } from 'os';

const coolantSchema = mongoose.Schema({
    coolant_id : {type : String, required: true},
    location_in_warehouse : {type: String}
})

const coolant = mongoose.model('coolant_metadata', coolantSchema);
export default coolant;