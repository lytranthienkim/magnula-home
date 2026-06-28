import { API } from "./config";

export const getAllCollection = async () => {
    const res = await API.get('/api/products/collections');
    return res.data;
}