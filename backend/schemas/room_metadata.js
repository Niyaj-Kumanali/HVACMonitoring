import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const roomSchema = new mongoose.Schema({
    room_id: {
        type: String,
        required: true,
        default: uuidv4
    },
    room_no: { type: String, required: true },
    room_name: { type: String, required: true },
    racks: { type: Number, required: true },
    power_point: { type: Number, required: true },
    slot: { type: Number, required: true },
    level_slots: { type: Map, of: [Number] },
    room_dimension: {
        height: {
            type: Number,
            required: false
        },
        width: {
            type: Number,
            required: false
        },
        depth: {
            type: Number,
            required: false
        },
    },
    placement: {
        x: {
            type: Number,
            required: false
        },
        y: {
            type: Number,
            required: false
        },
        z: {
            type: Number,
            required: false
        },
    },
    userId: { type: String, required: true },
    warehouse_id: { type: String, required: false },
})

const roomModel = mongoose.model('room_metadata', roomSchema);
export { roomSchema, roomModel };