import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.DEV
        ? '/api'
        : 'https://mathinova-backend-420478767625.us-central1.run.app/api',
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Attach JWT
api.interceptors.request.use((config) => {
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    const token = localStorage.getItem('mathinova_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
});

// Response Interceptor: Handle Globals
api.interceptors.response.use(
    (response) => {
        console.log(`[API Response] ${response.status} ${response.config.url}`);
        return response;
    },
    (error) => {
        console.error('[API Error]', error.message, error.response?.status);
        if (error.code === 'ECONNABORTED') {
            console.error('Request timed out');
        }
        if (error.response?.status === 401) {
            // Handle session expiration
            console.log('Session expired, redirecting to login...');
            localStorage.removeItem('mathinova_token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
