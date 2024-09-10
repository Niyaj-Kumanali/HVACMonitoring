import axios, { AxiosInstance } from 'axios';

export const mongoAPI: AxiosInstance = axios.create({

  baseURL: 'http://localhost:2000',
  headers: {
    'Content-Type': 'application/json',
  },
});


export const getAllWarehouseByUserId = async (userId: string) => {
  const response = await mongoAPI.get(`/warehouse/getallwarehouse/${userId}`);
  return response;
};

export const addWarehouse = async () => {
  const response = await mongoAPI.post(`/warehouse/addwarehouse`);
  return response;
};

export const getAllWarehouses = async () => {
  const response = await mongoAPI.get(`/warehouse/getallwarehouse`);
  return response;
};

export const getAllWarehouseByWarehouseId = async (warehouseId: string) => {
  const response = await mongoAPI.get(`/warehouse/getwarehouse/${warehouseId}`);
  return response;
};

export const deleteWarehouseByWarehouseId = async (warehouseId: string) => {
  const response = await mongoAPI.delete(`/warehouse/deletewarehouse/${warehouseId}`);
  return response;
};

export const updateWarehouseByWarehouseId = async (warehouseId: string) => {
  const response = await mongoAPI.put(`/warehouse/updatewarehouse/${warehouseId}`);
  return response;
};


// 3.111.205.170
// localhost
