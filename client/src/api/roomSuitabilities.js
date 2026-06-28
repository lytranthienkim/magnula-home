import { API } from "./config";

export const getAllRoomSuitabilities = async () => {
    const res = await API.get('/api/products/room-suitabilities');
    return res.data;
};