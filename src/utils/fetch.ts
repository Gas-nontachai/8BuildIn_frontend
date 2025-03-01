import axios from 'axios';
import Swal from 'sweetalert2';

const preSecureFetch = axios.create({
    headers: {
        'Content-Type': 'application/json',
    }
});

preSecureFetch.interceptors.response.use(
    (response) => response.data,
    (error) => {
        return errorInterceptor(error);
    }
);

export const errorInterceptor = async (error: any): Promise<any> => {
    if (error?.response) {
        const { status, statusText, data } = error.response;
        const message = data?.message || `${status} ${statusText}`;
        Swal.fire({
            title: 'Request failed',
            text: message,
            icon: "error",
        });
    } else {
        Swal.fire({
            title: 'Unable to connect',
            text: 'Network or Server error',
            icon: "error",
        });
    }

    return Promise.reject(error);
};

export default preSecureFetch;
