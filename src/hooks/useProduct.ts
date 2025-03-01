import { API_URL } from '@/utils/config';
import axiosInstance from '@/utils/fetch';
import { Product } from '@/misc/types'

const prefix = 'product-category';

const getProductBy = (data: any = {}): Promise<{ docs: Product[], totalDocs: number }> => {
    return axiosInstance.post(`${API_URL}${prefix}/getProductBy`, data);
};

const getProductByID = (data: { product_id: string }): Promise<Product> => {
    return axiosInstance.post(`${API_URL}${prefix}/getProductByID`, data);
};

const insertProduct = async (data: Product): Promise<Product> => {
    return await axiosInstance.post(`${API_URL}${prefix}/insertProduct`, data);
};

const updateProductBy = async (data: Product): Promise<Product> => {
    return await axiosInstance.post(`${API_URL}${prefix}/updateProductBy`, data);
};

const deleteProductBy = (data: { product_id: string }): Promise<Product> => {
    return axiosInstance.post(`${API_URL}${prefix}/deleteProductBy`, data);
};

export default function useProduct() {
    return {
        getProductBy,
        getProductByID,
        insertProduct,
        updateProductBy,
        deleteProductBy,
    };
}
