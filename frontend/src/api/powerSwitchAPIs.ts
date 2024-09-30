import { mongoAPI } from "./MongoAPIInstance"

export const addSwitch = async (body:any) => {
    const response = mongoAPI.post(`/powerswitch/addpowerswitch`, body)
    return response
}

export const updateSwitch = async (body:any) => {
    const response = mongoAPI.put(`/powerswitch/updateswitch`, body)
    return response
}

export const getAllSwitchs = async () => {
    const response = mongoAPI.get(`/powerswitch/getallpowerswitches`)
    return response
}

export const getSwitchByPowerSourceId = async (body:any) => {
    const response = mongoAPI.get(`/powerswitch/updateswitch`, body)
    return response
}