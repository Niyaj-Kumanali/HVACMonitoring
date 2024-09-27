import { mongoAPI } from "./MongoAPIInstance";

export const getAllVehiclesByUserId = async (userId: string = "", params: any) => {
    const response = await mongoAPI.get(`vehicle/getallvehicle/${userId}`, {params: params});
    return response;
  };
  
  export const addVehicle = async (data:any) => {
    const response = await mongoAPI.post(`/vehicle/addvehicle`, data);
    return response;
  };
  
  export const getAllVehicles = async () => {
    const response = await mongoAPI.get(`/vehicle/getallvehicle`);
    return response;
  };
  
  export const getVehicleByVehicleId = async (vehicleId: string = "") => {
    const response = await mongoAPI.get(`/vehicle/getbyvehicleid/${vehicleId}`);
    
    return response;
  };
  
  export const deleteVehicleByVehicleId = async (vehicleId: string = "") => {
    const response = await mongoAPI.delete(`/vehicle/deletevehicle/${vehicleId}`);
    return response;
  };
  
  export const updateVehicleByVehicleId = async (vehicleId: string = "") => {
    const response = await mongoAPI.put(`/vehicle/updatevehicle/${vehicleId}`);
    return response;
  };