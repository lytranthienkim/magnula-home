import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://magnula-home-production.up.railway.app/api';

console.log('🔍 CLIENT - process.env.NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
console.log('🔍 CLIENT - Final API_URL:', API_URL);

export const API = axios.create({
    baseURL: API_URL,
    withCredentials: true
});