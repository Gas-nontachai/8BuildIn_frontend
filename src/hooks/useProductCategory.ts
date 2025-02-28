import axios from 'axios';
import { API_URL } from '@/utils/API_URL';
import { ProductCategory } from '@/misc/product-category'

const prefix = 'product-category';

const axiosInstance = axios.create({
    headers: {
        'Content-Type': 'application/json',
    }
});

const getProductCategoryBy = (data: any = {}): Promise<{ docs: ProductCategory[], totalDocs: number }> => {
    return axiosInstance.post(`${API_URL}${prefix}/getProductCategoryBy`, data);
};

const getProductCategoryByID = (data: { productcategory_id: string }): Promise<ProductCategory> => {
    return axiosInstance.post(`${API_URL}${prefix}/getProductCategoryByID`, data);
};

const insertProductCategory = async (data: ProductCategory): Promise<ProductCategory> => {
    return await axiosInstance.post(`${API_URL}${prefix}/insertProductCategory`, data);
};

const updateProductCategoryBy = async (data: ProductCategory): Promise<ProductCategory> => {
    return await axiosInstance.post(`${API_URL}${prefix}/updateProductCategoryBy`, data);
};

const deleteProductCategoryBy = (data: { productcategory_id: string }): Promise<ProductCategory> => {
    return axiosInstance.post(`${API_URL}${prefix}/deleteProductCategoryBy`, data);
};

export default function useProductCategory() {
    return {
        getProductCategoryBy,
        getProductCategoryByID,
        insertProductCategory,
        updateProductCategoryBy,
        deleteProductCategoryBy,
    };
}
