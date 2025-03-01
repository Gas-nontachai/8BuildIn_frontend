import { API_URL } from '@/utils/config';
import axiosInstance from '@/utils/fetch';
import { Supplier } from '@/misc/types'

const prefix = 'supplier';

const getSupplierBy = (data: any = {}): Promise<{ docs: Supplier[], totalDocs: number }> => {
    return axiosInstance.post(`${API_URL}${prefix}/getSupplierBy`, data);
};

const getSupplierByID = (data: { supplier_id: string }): Promise<Supplier> => {
    return axiosInstance.post(`${API_URL}${prefix}/getSupplierByID`, data);
};

const insertSupplier = async (data: Supplier): Promise<Supplier> => {
    return await axiosInstance.post(`${API_URL}${prefix}/insertSupplier`, data);
};

const updateSupplierBy = async (data: Supplier): Promise<Supplier> => {
    return await axiosInstance.post(`${API_URL}${prefix}/updateSupplierBy`, data);
};

const deleteSupplierBy = (data: { supplier_id: string }): Promise<Supplier> => {
    return axiosInstance.post(`${API_URL}${prefix}/deleteSupplierBy`, data);
};

export default function useSupplier() {
    return {
        getSupplierBy,
        getSupplierByID,
        insertSupplier,
        updateSupplierBy,
        deleteSupplierBy,
    };
}
