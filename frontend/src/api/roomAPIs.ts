import { mongoAPI } from "./MongoAPIInstance"

export const addRoom = async(body:any)=> {
    const response = await mongoAPI.post(`/room/addroom`, body)
    return response
}