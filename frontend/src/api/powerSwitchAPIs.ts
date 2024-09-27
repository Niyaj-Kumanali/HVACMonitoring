import { mongoAPI } from "./MongoAPIInstance"

export const updateSwitch = async (body:any) => {
    const response = mongoAPI.put(`/powerswitch/updateswitch`, body)
    return response
}