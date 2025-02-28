import axios from 'axios';
const axiosInstance = axios.create({
    headers: {
        'Content-Type': 'application/json',
    }
});

axiosInstance.interceptors.response.use(
    (response) => response.data,
    (error) => {
        return Promise.reject(error);
    }
);
export default axiosInstance;
