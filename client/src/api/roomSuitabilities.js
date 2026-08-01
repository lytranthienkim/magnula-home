import { API } from "./config";

export const getAllRoomSuitabilities = async () => {
    const res = await API.get('/products/room-suitabilities');
    return res.data;
};