import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const sensorSchema = new mongoose.Schema({
    sensor_id: { 
        type: String, 
        required: true,
        default: uuidv4
    },
    indoor_location: { type: String },
    Type: [{ type: String, required: true }],
    date_of_installation: { type: Date },
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
sensorSchema.pre('validate', function(next) {
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

const Sensor = mongoose.model('sensor_metadata', sensorSchema);

export default Sensor;
