export const setDevices = (devices: any[]) => {
    return{
        type : "SET_DEVICES",
        payload: devices
    };
};