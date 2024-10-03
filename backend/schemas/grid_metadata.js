import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const gridSchema = mongoose.Schema({
    grid_id : {
        type : String , 
        required : true,
        default : uuidv4
    },
    grid_name : {type: String},
    output_voltage : {type: Number},
    max_output_current : {type: Number},
    output_connector_type : {type: String},
    userId: { type: String, required: true },
    warehouse_id: { type: String, required: false },
})

const gridModel = mongoose.model("grid_metadata", gridSchema)
export { gridModel, gridSchema}