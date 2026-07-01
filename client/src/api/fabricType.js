import { API } from "./config";

export const getAllFabricTypes = async () => {
    const res = await API.get('/products/fabric-types');
    return res.data;
};