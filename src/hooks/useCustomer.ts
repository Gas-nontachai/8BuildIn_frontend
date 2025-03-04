import { API_URL } from '@/utils/config';
import { preSecureFetch } from '@/utils/fetch';
import { Customer } from '@/misc/types'

const prefix = 'customer';

const getCustomerBy = (data: any = {}): Promise<{ docs: Customer[], totalDocs: number }> => {
    return preSecureFetch.post(`${API_URL}${prefix}/getCustomerBy`, data);
};

const getCustomerByID = (data: { customer_id: string }): Promise<Customer> => {
    return preSecureFetch.post(`${API_URL}${prefix}/getCustomerByID`, data);
};

const insertCustomer = async (data: Customer): Promise<Customer> => {
    return await preSecureFetch.post(`${API_URL}${prefix}/insertCustomer`, data);
};

const updateCustomerBy = async (data: Customer): Promise<Customer> => {
    return await preSecureFetch.post(`${API_URL}${prefix}/updateCustomerBy`, data);
};

const deleteCustomerBy = (data: { customer_id: string }): Promise<Customer> => {
    return preSecureFetch.post(`${API_URL}${prefix}/deleteCustomerBy`, data);
};

export default function useCustomer() {
    return {
        getCustomerBy,
        getCustomerByID,
        insertCustomer,
        updateCustomerBy,
        deleteCustomerBy
    };
}
