import { mongoAPI } from "./MongoAPIInstance";

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