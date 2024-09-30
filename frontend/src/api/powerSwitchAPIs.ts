import { mongoAPI } from "./MongoAPIInstance"

export const addSwitch = async (body:any) => {
    const response = mongoAPI.put(`/powerswitch/addpowerswitch`, body)
    return response
}

export const updateSwitch = async (body:any) => {
    const response = mongoAPI.post(`/powerswitch/updateswitch`, body)
    return response
}