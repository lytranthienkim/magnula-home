import { API } from "./config";

export const getAllMaterials = async () => {
    const res = await API.get('/products/materials');
    return res.data;
};