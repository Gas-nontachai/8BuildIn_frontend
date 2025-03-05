import { API_URL } from '@/utils/config';
import { SecureFetch } from '@/utils/fetch';
import { Cart } from '@/misc/types'

const prefix = 'cart';

const getCartBy = (data: any = {}): Promise<{ docs: Cart[], totalDocs: number }> => {
    return SecureFetch.post(`${API_URL}${prefix}/getCartBy`, data);
};

const getCartByID = (data: { cart_id: string }): Promise<Cart> => {
    return SecureFetch.post(`${API_URL}${prefix}/getCartByID`, data);
};

const insertCart = async (data: Cart): Promise<Cart> => {
    return await SecureFetch.post(`${API_URL}${prefix}/insertCart`, data);
};

const updateCartBy = async (data: Cart): Promise<Cart> => {
    return await SecureFetch.post(`${API_URL}${prefix}/updateCartBy`, data);
};

const deleteCartBy = (data: { cart_id: string }): Promise<Cart> => {
    return SecureFetch.post(`${API_URL}${prefix}/deleteCartBy`, data);
};

export default function useCart() {
    return {
        getCartBy,
        getCartByID,
        insertCart,
        updateCartBy,
        deleteCartBy
    };
}
