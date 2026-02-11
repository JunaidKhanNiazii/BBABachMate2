import axios from 'axios';
import { auth } from '../firebase'; // Adjust path if needed

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api', // Backend URL
    headers: {
        'Content-Type': 'application/json',
    },
});

const cache = new Map();
const CACHE_DURATION = 5000; // 5 seconds

// Request Interceptor to add Firebase Token and check cache
api.interceptors.request.use(
    async (config) => {
        // 1. Add Token
        const user = auth.currentUser;
        if (user) {
            const token = await user.getIdToken();
            config.headers.Authorization = `Bearer ${token}`;
        }

        // 2. Cache Logic (GET only)
        if (config.method === 'get') {
            const cacheKey = config.url + JSON.stringify(config.params || {});
            const cachedData = cache.get(cacheKey);

            if (cachedData && (Date.now() - cachedData.timestamp < CACHE_DURATION)) {
                // Return a mock promise that resolves with the cached data
                config.adapter = () => {
                    return Promise.resolve({
                        data: cachedData.data,
                        status: 200,
                        statusText: 'OK',
                        headers: {},
                        config,
                        request: {}
                    });
                };
            }
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor to store in cache
api.interceptors.response.use(
    (response) => {
        if (response.config.method === 'get') {
            const cacheKey = response.config.url + JSON.stringify(response.config.params || {});
            cache.set(cacheKey, {
                data: response.data,
                timestamp: Date.now()
            });
        }
        return response;
    },
    (error) => Promise.reject(error)
);

export default api;
