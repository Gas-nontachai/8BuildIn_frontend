import axios from 'axios';
import Swal from 'sweetalert2';
import { getAccessToken, getRefreshToken } from '@/context/AuthContext';

const SecureFetch = axios.create({
    headers: {
        'Content-Type': 'application/json',
    }
});

SecureFetch.interceptors.request.use(
    (config) => {
        const accessToken = getAccessToken();
        if (accessToken) {
            config.headers['x-access-token'] = accessToken;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

SecureFetch.interceptors.response.use(
    (response) => response.data,
    (error) => errorInterceptor(error)
);

const formData = axios.create({
    headers: {
        'Content-Type': 'multipart/form-data',
    }
});

formData.interceptors.request.use(
    (config) => {
        const accessToken = getAccessToken();
        if (accessToken) {
            config.headers['x-access-token'] = accessToken;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

formData.interceptors.response.use(
    (response) => response.data,
    (error) => errorInterceptor(error)
);

export const errorInterceptor = async (error: any): Promise<any> => {
    if (error?.response) {
        const { status, statusText, data } = error.response;
        const message = data?.message || `${status} ${statusText}`;

        if (status === 401) {
            const refreshToken = getRefreshToken();
            if (refreshToken) {
                try {
                    const response = await axios.post('/auth/refresh', { refreshToken });
                    const { accessToken, refreshToken: newRefreshToken } = response.data;

                    localStorage.setItem('access_token', accessToken);
                    localStorage.setItem('refresh_token', newRefreshToken);

                    error.config.headers['x-access-token'] = accessToken;
                    return axios(error.config);
                } catch (refreshError) {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    window.location.href = '/login';
                }
            }
        }

        Swal.fire({
            title: 'Request failed',
            text: message,
            icon: 'error',
        });
    } else {
        Swal.fire({
            title: 'Unable to connect',
            text: 'Network or Server error',
            icon: 'error',
        });
    }

    return Promise.reject(error);
};

export { SecureFetch, formData };
