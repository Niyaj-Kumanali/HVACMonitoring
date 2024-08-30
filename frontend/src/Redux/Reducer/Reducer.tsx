// import { User } from "../../types/thingsboardTypes";

interface Userstate {
    accesstoken: string | null;
}
const initial_state: any = {
    // user: null ,
    accesstoken: null,
    usercount: 0,
    warehousecount: 0,
    deviceCount :0,
    vehicle :0,
    authority: "CUSTOMER_USER"
}

const userReducer = (state = initial_state, action: any): Userstate => {
    switch (action.type) {
        // case "SET_USER" :
        //     return {
        //         ...state,
        //         user: action.payload
        //     };

        case "SET_DEVICE_COUNT":
            return {
                ...state,
                deviceCount: action.payload
            }

        case "SET_ACCESSTOKEN":
            return {
                ...state,
                accesstoken: action.payload
            }
        case "SET_USER_COUNT":
            return {
                ...state,
                userCount: action.payload
            }

        case "SET_WAREHOUSE_COUNT":
            return {
                ...state,
                warehouseCount: action.payload
            }
        case "SET_VEHICLE_COUNT":
            return {
                ...state,
                vehicleCount: action.payload
            }
        case "SET_Authority":
            return {
                ...state,
                authority: action.payload
            }
        default:
            return state;
    }
}

export default userReducer;