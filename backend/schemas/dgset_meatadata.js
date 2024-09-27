import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { type } from 'os';

const dgsetSchema = mongoose.Schema({
    dgset_id : {
        type : String , 
        required : true,
        default : uuidv4
    },
    dgset_name : {type: String},
    output_voltage : {type: Number},
    max_output_current : {type: Number},
    fuel_type : {type: String},
    fuel_capacity : {type: String},
    output_connector_type : {type: String},
    motor_type : {type: String}
})

const dgsetModel = mongoose.model('dgSet_metadata', dgsetSchema)
export {dgsetModel, dgsetSchema}