import axios from 'axios';

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000'
});

instance.interceptors.request.use(config => {
    config.headers['Content-Type'] = 'application/json';
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

instance.interceptors.response.use(response => {
    return response.data;
}, error => {
    return Promise.reject(error);
});

export default instance;