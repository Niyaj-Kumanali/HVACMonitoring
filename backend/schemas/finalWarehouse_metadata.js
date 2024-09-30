import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { roomSchema } from '../schemas/room_metadata.js';

const finalwarehouseSchema = new mongoose.Schema({ // Using new mongoose.Schema for clarity
    warehouse_id: {
        type: String, 
        required: true,
        default: uuidv4
    },
    warehouse_name: {
        type: String, 
        required: true
    },
    latitude: {
        type: Number, 
        required: true,
        validate: {
            validator: function(value) {
                return value >= -90 && value <= 90; // Valid range for latitude
            },
            message: 'Latitude must be between -90 and 90'
        }
    },
    longitude: {
        type: Number, 
        required: true,
        validate: {
            validator: function(value) {
                return value >= -180 && value <= 180; // Valid range for longitude
            },
            message: 'Longitude must be between -180 and 180'
        }
    },
    warehouse_dimensions: {
        length: {
            type: Number,
            required: true,
            min: 0 // Ensure length is a positive number
        },
        width: {
            type: Number,
            required: true,
            min: 0 // Ensure width is a positive number
        },
        height: {
            type: Number,
            required: true,
            min: 0 // Ensure height is a positive number
        },
    },
    rooms: {
        type : []
    },
    powerSource: {
        type : []
    }
});

const finalwarehouse = mongoose.model('finalWarehouse_metadata', finalwarehouseSchema);
export default finalwarehouse;
