import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

// Define the refrigerator schema
const refrigeratorSchema = new mongoose.Schema({
    refrigerator_id: {
        type: String, 
        required: true,
        default: uuidv4  // Generates a UUID if no value is provided
    },
    refrigerator_name: { 
        type: String, 
        required: false 
    },
    roomId: { 
        type: String, 
        required: false 
    },
    make: { 
        type: String, 
        required: false 
    },
    capability: { 
        type: String, 
        required: false 
    },
    star_rating: { 
        type: String, 
        required: false 
    },
    type: { 
        type: String, 
        required: false 
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
    registered_location: {
        x: { 
            type: Number, 
            required: false 
        },
        y: { 
            type: Number, 
            required: false 
        },
    },
    userId: { 
        type: String, 
        required: true 
    },
    warehouse_id: { 
        type: String, 
        required: false 
    },
});


// Create the model
const refrigeratorModel = mongoose.model("refrigerator_metadata", refrigeratorSchema);

// Export the model and schema
export { refrigeratorModel, refrigeratorSchema };
