import { API_URL } from '@/utils/config';
import { preSecureFetch, formData } from '@/utils/fetch';
import { Supplier } from '@/misc/types'

const prefix = 'supplier';

const getSupplierBy = (data: any = {}): Promise<{ docs: Supplier[], totalDocs: number }> => {
    return preSecureFetch.post(`${API_URL}${prefix}/getSupplierBy`, data);
};

const getSupplierByID = (data: { supplier_id: string }): Promise<Supplier> => {
    return preSecureFetch.post(`${API_URL}${prefix}/getSupplierByID`, data);
};

const insertSupplier = async (data: { supplier: Supplier, supplier_img?: File[] }): Promise<Supplier> => {
    const formDataInstance = new FormData();
    formDataInstance.append("supplier", JSON.stringify(data.supplier));
    if (data.supplier_img && data.supplier_img.length > 0) {
        data.supplier_img.forEach((file, index) => {
            formDataInstance.append(`supplier_img_${index}`, file);
        });
    }
    return await formData.post(`${API_URL}${prefix}/insertSupplier`, formDataInstance);
};

const updateSupplierBy = async (data: { supplier: Supplier, supplier_img?: File[] }): Promise<Supplier> => {
    const formDataInstance = new FormData();
    formDataInstance.append("supplier", JSON.stringify(data.supplier));
    if (data.supplier_img && data.supplier_img.length > 0) {
        data.supplier_img.forEach((file, index) => {
            formDataInstance.append(`supplier_img_${index}`, file);
        });
    }
    return await formData.post(`${API_URL}${prefix}/updateSupplierBy`, formDataInstance);
};

const deleteSupplierBy = (data: { supplier_id: string }): Promise<Supplier> => {
    return preSecureFetch.post(`${API_URL}${prefix}/deleteSupplierBy`, data);
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
