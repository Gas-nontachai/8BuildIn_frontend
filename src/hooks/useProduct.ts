import { API_URL } from '@/utils/config';
import { SecureFetch, formData } from '@/utils/fetch';
import { Product } from '@/misc/types'

const prefix = 'product';

const getProductBy = (data: any = {}): Promise<{ docs: Product[], totalDocs: number }> => {
    return SecureFetch.post(`${API_URL}${prefix}/getProductBy`, data);
};

const getProductByID = (data: { product_id: string }): Promise<Product> => {
    return SecureFetch.post(`${API_URL}${prefix}/getProductByID`, data);
};

const insertProduct = async (data: { product: Product, product_img?: File[] }): Promise<Product> => {
    const formDataInstance = new FormData();
    formDataInstance.append("product", JSON.stringify(data.product));

    if (data.product_img && data.product_img.length > 0) {
        data.product_img.forEach((file, index) => {
            formDataInstance.append(`product_img_${index}`, file);
        });
    }

    return await formData.post(`${API_URL}${prefix}/insertProduct`, formDataInstance);
};

const updateProductBy = async (data: { product: Product, product_img?: File[], del_img_arr?: string[] }): Promise<Product> => {
    const formDataInstance = new FormData();
    formDataInstance.append("product", JSON.stringify(data.product));
    formDataInstance.append("del_img_arr", JSON.stringify(data.del_img_arr));

    if (data.product_img && data.product_img.length > 0) {
        data.product_img.forEach((file, index) => {
            formDataInstance.append(`product_img_${index}`, file);
        });
    }

    return await formData.post(`${API_URL}${prefix}/updateProductBy`, formDataInstance);
};

const deleteProductBy = (data: { product_id: string }): Promise<Product> => {
    return SecureFetch.post(`${API_URL}${prefix}/deleteProductBy`, data);
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
