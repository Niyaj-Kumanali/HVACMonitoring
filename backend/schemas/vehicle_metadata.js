import mongoose from 'mongoose';
import { type } from 'os';

const vehicleSchema = new mongoose.Schema({
    vehicle_id : {type : String, required : true},
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
    cooling_units :[{
        coolant : {type:  mongoose.Schema.Types.ObjectId, ref:'coolant_metadata'},
        coolant_used : {type: String, required:true}
    }],
    sensors :[{
        sensor : {type: mongoose.Schema.Types.ObjectId, ref:'sensor_meatadata'},
        
    }]
})


const vehicle = mongoose.model('vehicle_metadata', vehicleSchema);
export default vehicle