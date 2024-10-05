import { mongoAPI } from "./MongoAPIInstance";

export const AddRefrigerators = async (body : any) => {
    const response = await mongoAPI.post(`/refrigerator/addrefrigerator`, body);
    return response;
};


export const getAllRefrigeratorbyUserId= async (userId : any) => {
    const response = await mongoAPI.get(`/refrigerator/getallrefrigerator/${userId}`);
    return response;
};