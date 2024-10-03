import { mongoAPI } from "./MongoAPIInstance"

export const addGRID = async (body:any) => {
    const response = await mongoAPI.post(`/grid/addgrid`, body)
    return response
}

export const getAllGRID = async () => {
    const response = await mongoAPI.get(`/grid/getallgrids`)
    return response
}

export const AddWarehouseIdToGrid = async (body: any) => {
    const response = await mongoAPI.put(`/grid/updategrids`, body)
    return response
}
