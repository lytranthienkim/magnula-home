import { API } from "./config";

export const getAllFabricTypes = async () => {
    const res = await API.get('/api/products/fabric-types');
    return res.data;
};