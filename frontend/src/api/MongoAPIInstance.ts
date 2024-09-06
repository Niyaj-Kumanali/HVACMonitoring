import axios, { AxiosInstance } from 'axios';

export const mongoAPI: AxiosInstance = axios.create({

  baseURL: 'http://3.111.205.170:2000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getAllWarehouseByUserId = async (userId: string) => {
  const response = await mongoAPI.get(`/warehouse/getallwarehouse/${userId}`);
  return response;
};



// 3.111.205.170
