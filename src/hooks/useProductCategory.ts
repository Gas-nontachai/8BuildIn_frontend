import { API_URL } from '@/utils/config';
import { preSecureFetch, formData } from '@/utils/fetch';
import { ProductCategory } from '@/misc/types'

const prefix = 'product-category';

const getProductCategoryBy = (data: any = {}): Promise<{ docs: ProductCategory[], totalDocs: number }> => {
    return preSecureFetch.post(`${API_URL}${prefix}/getProductCategoryBy`, data);
};

const getProductCategoryByID = (data: { product_category_id: string }): Promise<ProductCategory> => {
    return preSecureFetch.post(`${API_URL}${prefix}/getProductCategoryByID`, data);
};

const insertProductCategory = async (data: ProductCategory): Promise<ProductCategory> => {
    return await preSecureFetch.post(`${API_URL}${prefix}/insertProductCategory`, data);
};

const updateProductCategoryBy = async (data: ProductCategory): Promise<ProductCategory> => {
    return await preSecureFetch.post(`${API_URL}${prefix}/updateProductCategoryBy`, data);
};

const deleteProductCategoryBy = (data: { product_category_id: string }): Promise<ProductCategory> => {
    return preSecureFetch.post(`${API_URL}${prefix}/deleteProductCategoryBy`, data);
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
