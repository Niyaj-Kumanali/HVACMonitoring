import { mongoAPI } from "./MongoAPIInstance"
import { roomsInUse } from "./warehouseAPIs"

export const addRoom = async (body: any) => {
    const response = await mongoAPI.post(`/room/addroom`, body)
    return response
}

export const getAllRooms = async () => {
    const response = await mongoAPI.get(`/room/getallrooms`)
    return response
}

export const getAllRoomsByUserId = async (body: {
    userId: string,
    warehouseId: string
}) => {
    console.log(body.userId)
    const response = await mongoAPI.post(`/room/getallrooms/${body.userId}`, body)
    return response;
}

export const updateLevelSlots = async (body: any) => {
    const response = await mongoAPI.put(`/room/update`, body)
    return response
}

export const deleteRoom = async (roomId: any) => {
    const response = await mongoAPI.delete(`/room/deleteroom/${roomId}`)
    return response
}


export const AddWarehouseIdToRooms = async (body: any) => {
    const response = await mongoAPI.put(`/room/updaterooms`, body)
    return response
}

export const getRoomByWarehouseId = async (warehouse_id: string) => {
    const response = await mongoAPI.get(`/room/rooms/${warehouse_id}`)
    return response
}

export const avaliableRooms = async (userId: string = "") => {
    const roomsOfUserId = await getAllRoomsByUserId(userId);
    const roomOccupied = await roomsInUse(userId)
    console.log('Rooms in Use:', roomOccupied)
    console.log('All Rooms:', roomsOfUserId)

    const availableRooms = roomsOfUserId.filter((room: any) =>
        !roomOccupied.some((occupiedRoom: any) => occupiedRoom.room_id === room.room_id)
    );

    console.log('Available Rooms:', availableRooms);
    return availableRooms;
}
