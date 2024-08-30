// import { User } from "../../types/thingsboardTypes";

// export const set_User = (user : User) => {
//     return{
//         type : "SET_USER",
//         payload : user
//     };
// };

export const set_Accesstoken = (accesstoken: String) => {
    return {
        type: "SET_ACCESSTOKEN",
        payload: accesstoken
    }
}

export const set_DeviceCount = (device: number = 0) => {
    return {
        type: "SET_DEVICE_COUNT",
        payload: device
    }
}

export const set_usersCount = (user: number) => {
    return {
        type: "SET_USER_COUNT",
        payload: user
    }
}

export const set_warehouse_count = (warehouse: number) => {
    return {
        type: "SET_WAREHOUSE_COUNT",
        payload: warehouse
    }
}

export const set_vehicle_count = (vehicle: number) => {
    return {
        type: "SET_VEHICLE_COUNT",
        payload: vehicle
    }
}

export const set_Authority = (authority: String) => {
    return {
        type: "SET_Authority",
        payload: authority
    }
}

