import { mongoAPI } from "./MongoAPIInstance"

export const addDGSET = async (body:any) => {
    const response = await mongoAPI.post(`/dgset/adddgset`, body)
    return response
}

export const getAllDGSET = async () => {
    const response = await mongoAPI.get(`/dgset/getalldgsets`)
    return response
}