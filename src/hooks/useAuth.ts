import axios from 'axios';
import { API_URL } from '@/utils/congig';
// import {  } from "~~/misc/types";

const prefix = 'auth';

const axiosInstance = axios.create({
    headers: {
        'Content-Type': 'application/json',
    }
});

const authLogin = (data: { employee_username: string, employee_password: string }): Promise<any> => {
    return axiosInstance.post(`${API_URL}${prefix}/login`, data);
};

// const register = async (data: { user: User, user_img?: File[] }): Promise<any> => {
//   const formData = new FormData();
//   formData.append("user", JSON.stringify(data.user));
//   if (data.user_img && data.user_img.length > 0) {
//     data.user_img.forEach((file, index) => {
//       formData.append(`user_img_${index}`, file);
//     });
//   }

//   return await axiosInstance.post(`/${prefix}/register`, formData, {
//     headers: {
//       'Content-Type': 'multipart/form-data', // ให้เป็น multipart สำหรับการอัพโหลดไฟล์
//     },
//   });
// };

// const authLogout = (): Promise<any> => {
//   return axiosInstance.post(`/${prefix}/logout`);
// };

// const getMyCredential = (): Promise<{ user: User, permissions: Permission[] }> => {
//   return axiosInstance.post(`/${prefix}/getMyCredential`);
// };

// const changePassword = (data: { current_password: string, new_password: string }): Promise<any> => {
//   return axiosInstance.post(`/${prefix}/changePassword`, data);
// };

// const refresh = (data: { refresh_token: string }): Promise<AuthToken> => {
//   return axiosInstance.post(`/${prefix}/refresh`, data);
// };

export default function useAuth() {
    return {
        authLogin,
    };
}
