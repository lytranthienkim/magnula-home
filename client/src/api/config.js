import axios from 'axios';
import { config } from '@/config/env';

export const API = axios.create({
    baseURL: config.apiUrl,
    withCredentials: true
});