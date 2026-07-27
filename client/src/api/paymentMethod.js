import { API } from "./config";
import { getCache, setCache, generateCacheKey } from "../utils/cache";

export const getAllPaymentMethods = async () => {
    const cacheKey = generateCacheKey('paymentMethods');
    const cached = getCache(cacheKey);

    if (cached) {
        return cached;
    }

    const response = await API.get('/payment-methods');
    setCache(cacheKey, response.data, 7200000);
    return response.data;
};
