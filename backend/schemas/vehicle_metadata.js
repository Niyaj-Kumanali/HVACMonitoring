import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { type } from 'os';

const vehicleSchema = new mongoose.Schema({
    vehicle_id : {
        type : String, 
        required : true,
        default: uuidv4
    },
    vehicle_number : {type : String, required : true},
    vehicle_name : {type : String, required : true},
    vehicle_dimensions :{
        length : {type: Number, required:true},
        width : {type: Number, required:true},
        height : {type: Number, required:true},
    },
    Driver_details :{
        driver_name : {type: String, required:true},
        driver_contact_no : {type: Number, required:true},
        licence_id : {type: String, required:true},
    },
    cooling_units :{type: Number, required: true},
    sensors :{type: Number, required: true},
    userId: {type: String, reqired: true},
    email: {type: String, reqired: true}
})


const vehicle = mongoose.model('vehicle_metadata', vehicleSchema);
export default vehicle