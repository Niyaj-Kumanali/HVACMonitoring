import { mongoAPI } from './MongoAPIInstance';

export const AddRefrigerators = async (body: any) => {
    const response = await mongoAPI.post(`/refrigerator/addrefrigerator`, body);
    return response;
};

export const getAllRefrigeratorbyUserId = async (body: {
    userId: string;
    warehouseId: string;
}) => {
    const response = await mongoAPI.post(
        `/refrigerator/getallrefrigerator/${body.userId}`,
        body
    );
    return response;
};

export const AddWarehouseIdToRefrigerator = async (body: any) => {
    const response = await mongoAPI.post(
        `/refrigerator/updaterefrigerators`,
        body
    );
    return response;
};
