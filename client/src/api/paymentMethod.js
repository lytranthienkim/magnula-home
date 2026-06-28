import { API } from "./config";

export const getAllPaymentMethods = async () => {
    const response = await API.get('/api/payment-methods');
    return response.data;
};
