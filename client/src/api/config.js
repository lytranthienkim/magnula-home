import axios from 'axios';

// ✅ Debug: Log env var value
console.log('🔍 API_URL env var:', process.env.NEXT_PUBLIC_API_URL);
console.log('🔍 Full env:', process.env);

export const API = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://magnula-home-production.up.railway.app/api',
    withCredentials: true
});