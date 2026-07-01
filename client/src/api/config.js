import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://magnula-home-production.up.railway.app/api';

export const API = axios.create({
    baseURL: API_URL,
    withCredentials: true
});