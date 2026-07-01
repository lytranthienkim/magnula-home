import { API } from "./config";

export const getAllPaymentMethods = async () => {
    const response = await API.get('/payment-methods');
    return response.data;
};
