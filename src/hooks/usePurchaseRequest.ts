import { API_URL } from '@/utils/config';
import { SecureFetch } from '@/utils/fetch';
import { PurchaseRequest } from '@/misc/types'

const prefix = 'purchase-request';

const getPurchaseRequestBy = (data: any = {}): Promise<{ docs: PurchaseRequest[], totalDocs: number }> => {
    return SecureFetch.post(`${API_URL}${prefix}/getPurchaseRequestBy`, data);
};

const getPurchaseRequestByID = (data: { purchaserequest_id: string }): Promise<PurchaseRequest> => {
    return SecureFetch.post(`${API_URL}${prefix}/getPurchaseRequestByID`, data);
};

const insertPurchaseRequest = async (data: PurchaseRequest): Promise<PurchaseRequest> => {
    return await SecureFetch.post(`${API_URL}${prefix}/insertPurchaseRequest`, data);
};

const updatePurchaseRequestBy = async (data: PurchaseRequest): Promise<PurchaseRequest> => {
    return await SecureFetch.post(`${API_URL}${prefix}/updatePurchaseRequestBy`, data);
};

const deletePurchaseRequestBy = (data: { purchaserequest_id: string }): Promise<PurchaseRequest> => {
    return SecureFetch.post(`${API_URL}${prefix}/deletePurchaseRequestBy`, data);
};

export default function usePurchaseRequest() {
    return {
        getPurchaseRequestBy,
        getPurchaseRequestByID,
        insertPurchaseRequest,
        updatePurchaseRequestBy,
        deletePurchaseRequestBy
    };
}
