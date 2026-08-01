import { API } from "./config";

export const getAllCollection = async () => {
    const res = await API.get('/products/collections');
    return res.data;
}