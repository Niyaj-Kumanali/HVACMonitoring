import { mongoAPI } from "./MongoAPIInstance"

export const addRoom = async(body:any)=> {
    const response = await mongoAPI.post(`/room/addroom`, body)
    return response
}

export const getAllRooms = async()=> {
    const response = await mongoAPI.get(`/room/getallrooms`)
    return response
}

export const updateLevelSlots = async(body:any)=> {
    const response = await mongoAPI.put(`/room/update`, body)
    return response
}

export const deleteRoom = async(roomId: any)=> {
    const response = await mongoAPI.delete(`/room/deleteroom/${roomId}`)
    return response
}


export const AddWarehouseIdToRooms = async(body: any)=> {
    const response = await mongoAPI.put(`/room/updaterooms`, body)
    return response
}

export const getRoomByWarehouseId = async(warehouse_id: string)=> {
    const response = await mongoAPI.get(`/room/rooms/${warehouse_id}`)
    return response
}
