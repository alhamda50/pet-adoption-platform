import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000' // Ensure this is correct for your backend
});

axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('token'); // Ensure this key matches local storage
        if (accessToken && !config.url.includes('/user/register') && !config.url.includes('/user/login')) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;


