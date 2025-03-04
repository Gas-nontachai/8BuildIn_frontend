import { API_URL } from '@/utils/config';
import { preSecureFetch, formData } from '@/utils/fetch';
import { Employee } from '@/misc/types'

const prefix = 'employee';

const getEmployeeBy = (data: any = {}): Promise<{ docs: Employee[], totalDocs: number }> => {
    return preSecureFetch.post(`${API_URL}${prefix}/getEmployeeBy`, data);
};

const getEmployeeByID = (data: { employee_id: string }): Promise<Employee> => {
    return preSecureFetch.post(`${API_URL}${prefix}/getEmployeeByID`, data);
};

const insertEmployee = async (data: { employee: Employee, employee_img?: File[] }): Promise<Employee> => {
    const formDataInstance = new FormData();
    formDataInstance.append("employee", JSON.stringify(data.employee));

    if (data.employee_img && data.employee_img.length > 0) {
        data.employee_img.forEach((file, index) => {
            formDataInstance.append(`employee_img_${index}`, file);
        });
    } 
    return await formData.post(`${API_URL}${prefix}/insertEmployee`, formDataInstance);
};

const updateEmployeeBy = async (data: { employee: Employee, employee_img?: File[] }): Promise<Employee> => {
    const formDataInstance = new FormData();
    formDataInstance.append("employee", JSON.stringify(data.employee)); 
    if (data.employee_img && data.employee_img.length > 0) {
        data.employee_img.forEach((file, index) => {
            formDataInstance.append(`employee_img_${index}`, file);
        });
    } 
    return await formData.post(`${API_URL}${prefix}/updateEmployeeBy`, formDataInstance);
};

const deleteEmployeeBy = (data: { employee_id: string }): Promise<Employee> => {
    return preSecureFetch.post(`${API_URL}${prefix}/deleteEmployeeBy`, data);
};

export default function useEmployee() {
    return {
        getEmployeeBy,
        getEmployeeByID,
        insertEmployee,
        updateEmployeeBy,
        deleteEmployeeBy,
    };
}
