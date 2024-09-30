import { mongoAPI } from "./MongoAPIInstance"

export const addSwitch = async (body:any) => {
    const response = mongoAPI.put(`/powerswitch/addpowerswitch`, body)
    return response
}

export const getAllSwitchs = async () => {
    const response = mongoAPI.get(`/powerswitch/getallpowerswitches`)
    return response
}

export const getSwitchByPowerSourceId = async (body:any) => {
    const response = mongoAPI.put(`/powerswitch/updateswitch`, body)
    return response
}