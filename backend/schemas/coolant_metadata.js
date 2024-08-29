import mongoose from 'mongoose';
import { type } from 'os';
import { v4 as uuidv4 } from 'uuid';

const coolantSchema = mongoose.Schema({
    coolant_id : {
        type: String, 
        required: true,
        default: uuidv4
    },
    location_in_warehouse : {type: String},
    warehouse_or_vehicle: {
        type: String,
        enum: ['warehouse', 'vehicle'],
        required: true
    },
    warehouse_id: {
        type: String,
        ref: 'warehouse_metadata',
        required: function() { return this.warehouse_or_vehicle === 'warehouse'; }
    },
    vehicle_id: {
        type: String,
        ref: 'vehicle_metadata',
        required: function() { return this.warehouse_or_vehicle === 'vehicle'; }
    }
});

// Custom validation to ensure only one of `warehouse_id` or `vehicle_id` is set
coolantSchema.pre('validate', function(next) {
    if (this.warehouse_or_vehicle === 'warehouse' && !this.warehouse_id) {
        return next(new Error('warehouse_id is required when warehouse_or_vehicle is "warehouse"'));
    }
    if (this.warehouse_or_vehicle === 'vehicle' && !this.vehicle_id) {
        return next(new Error('vehicle_id is required when warehouse_or_vehicle is "vehicle"'));
    }
    if (this.warehouse_or_vehicle === 'warehouse' && this.vehicle_id) {
        return next(new Error('vehicle_id should not be set when warehouse_or_vehicle is "warehouse"'));
    }
    if (this.warehouse_or_vehicle === 'vehicle' && this.warehouse_id) {
        return next(new Error('warehouse_id should not be set when warehouse_or_vehicle is "vehicle"'));
    }
    next();
});

const coolant = mongoose.model('coolant_metadata', coolantSchema);
export default coolant;