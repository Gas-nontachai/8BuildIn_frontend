import { API_URL } from '@/utils/api_url';
import axiosInstance from '@/utils/axiosInstance';
import { ProductCategory } from '@/misc/types'

const prefix = 'product-category';

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
