import axios, { AxiosInstance } from 'axios';
import { DashboardLayoutOptions } from '../Redux/Reducer/layoutReducer';

export const mongoAPI: AxiosInstance = axios.create({

  // baseURL: 'https://hvac.myoorja.in',
  baseURL: 'http://localhost:2000',
  headers: {
    'Content-Type': 'application/json',
  },
});


// 3.111.205.170
// localhost

export const postLayout = async (dashboardId: string = "", layout: DashboardLayoutOptions) => {
  const response = await mongoAPI.post(`/dashboard/saveDashboardLayout/${dashboardId}`, layout);
  return response
}

export const getLayout = async (dashboardId: string = "") => {
  const response = await mongoAPI.get(`/dashboard/getDashboardLayout/${dashboardId}`)
  return response
}


export const getAllWarehouseByUserId = async (userId: string = "", params: any) => {
  const response = await mongoAPI.get(`/warehouse/getallwarehouse/${userId}`, {params: params});
  return response;
};

export const addWarehouse = async (data:any) => {
  const response = await mongoAPI.post(`/warehouse/addwarehouse`, data);
  return response;
};

export const getAllWarehouses = async () => {
  const response = await mongoAPI.get(`/warehouse/getallwarehouse`);
  return response;
};

export const getWarehouseByWarehouseId = async (warehouseId: string = "") => {
  const response = await mongoAPI.get(`/warehouse/getwarehouse/${warehouseId}`);
  return response;
};

export const deleteWarehouseByWarehouseId = async (warehouseId: string = "") => {
  const response = await mongoAPI.delete(`/warehouse/deletewarehouse/${warehouseId}`);
  return response;
};

export const updateWarehouseByWarehouseId = async (warehouseId: string = "", data: any) => {
  const response = await mongoAPI.put(`/warehouse/updatewarehouse/${warehouseId}`, data);
  return response;
};

export const getLocationByLatsAndLongs = async (latitude: string , longitude: string ) => {
  const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`);
  return response
}



// vehicle apis

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




