import mongoose from 'mongoose';
import { type } from 'os';


    const warehouseSchema = new mongoose.Schema({
        warehouse_id : {type : String , required : true},
        warehouse_name : {type : String , required : true},
        latitude : {type : Number , required : true},
        longitude : {type : Number , required : true},
        warehouse_dimensions :{
            length : {type: Number, required:true},
            width : {type: Number, required:true},
            height : {type: Number, required:true},
        },
        energy_resource : {type: String, required: true},
        cooling_units :[{
            coolant : {type:  mongoose.Schema.Types.ObjectId, ref:'coolant_metadata'},
            coolant_used : {type: String, required:true}
        }],
        sensors :[{
            sensor : {type: mongoose.Schema.Types.ObjectId, ref:'sensor_meatadata'},
            rack_id : {type: Number, required:true},
            shelf_id : {type: Number, required:true}
        }]

    })

    const warehouse = mongoose.model('warehouse_metadata', warehouseSchema);
    export default warehouse;