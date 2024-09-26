import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { dgsetModel } from '../schemas/dgset_meatadata.js';  
import { gridModel } from '../schemas/grid_metadata.js';   

const powerSwitchSchema = new mongoose.Schema({
    powerSource_id : {
        type : String , 
        required : true,
        default : uuidv4
    },
    powerSource_status: {
        type: Boolean,
        required: true
    },
    power_source: {
        type: Object, // To dynamically assign dgset or grid
        required: true
    },
    dgset: {
        type: String,
        ref: 'dgset_metadata',  // Refers to the dgset schema
        required: function () {
            return this.powerSource_status === true;  // Required if position is true (ON)
        }
    },
    grid: {
        type: String,
        ref: 'grid_metadata',  // Refers to the grid schema
        required: function () {
            return this.powerSource_status === false;  // Required if position is false (OFF)
        }
    }
});

// Add a pre-save middleware to handle power_source assignment
powerSwitchSchema.pre('save', function (next) {
    if (this.powerSource_status) {
        // When the switch is ON, use dgset as power source
        this.power_source = this.dgset;
        this.dgset = undefined;
        
    } else {
        // When the switch is OFF, use grid as power source
        this.power_source = this.grid;
        this.grid = undefined;
    }
    next();
});

const powerswitchModel = mongoose.model('powerswitch_metadata', powerSwitchSchema);

export {powerswitchModel, powerSwitchSchema}
