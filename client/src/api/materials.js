import { API } from "./config";

export const getAllMaterials = async () => {
    const res = await API.get('/api/products/materials');
    return res.data;
};