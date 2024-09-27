import { mongoAPI } from "./MongoAPIInstance"

export const addGRID = async (body:any) => {
    const response = await mongoAPI.post(`/grid/addgrid`, body)
    return response
}