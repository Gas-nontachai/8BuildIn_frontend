import { API_URL } from '@/utils/config';
import { SecureFetch } from '@/utils/fetch';
import { PurchaseOrder } from '@/misc/types'

const prefix = 'purchaseorder';

const getPurchaseOrderBy = (data: any = {}): Promise<{ docs: PurchaseOrder[], totalDocs: number }> => {
    return SecureFetch.post(`${API_URL}${prefix}/getPurchaseOrderBy`, data);
};

const getPurchaseOrderByID = (data: { purchaseorder_id: string }): Promise<PurchaseOrder> => {
    return SecureFetch.post(`${API_URL}${prefix}/getPurchaseOrderByID`, data);
};

const insertPurchaseOrder = async (data: PurchaseOrder): Promise<PurchaseOrder> => {
    return await SecureFetch.post(`${API_URL}${prefix}/insertPurchaseOrder`, data);
};

const updatePurchaseOrderBy = async (data: PurchaseOrder): Promise<PurchaseOrder> => {
    return await SecureFetch.post(`${API_URL}${prefix}/updatePurchaseOrderBy`, data);
};

const deletePurchaseOrderBy = (data: { purchaseorder_id: string }): Promise<PurchaseOrder> => {
    return SecureFetch.post(`${API_URL}${prefix}/deletePurchaseOrderBy`, data);
};

export default function usePurchaseOrder() {
    return {
        getPurchaseOrderBy,
        getPurchaseOrderByID,
        insertPurchaseOrder,
        updatePurchaseOrderBy,
        deletePurchaseOrderBy
    };
}
