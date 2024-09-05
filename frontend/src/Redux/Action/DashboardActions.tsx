export const setDevices = (devices: any[]) => {
    return{
        type : "SET_DEVICES",
        payload: devices
    };
};

export const saveDashboard = (dashboard: Object) => {

    return {
        type: "SAVE_DASHBOARD",
        payload: dashboard
    }
}