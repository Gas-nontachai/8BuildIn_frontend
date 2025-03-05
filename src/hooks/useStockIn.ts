import { API_URL } from '@/utils/config';
import { SecureFetch, formData } from '@/utils/fetch';
import { StockIn } from '@/misc/types'

const prefix = 'stock-in';

const getStockInBy = (data: any = {}): Promise<{ docs: StockIn[], totalDocs: number }> => {
    return SecureFetch.post(`${API_URL}${prefix}/getStockInBy`, data);
};

const getStockInByID = (data: { stock_in_id: string }): Promise<StockIn> => {
    return SecureFetch.post(`${API_URL}${prefix}/getStockInByID`, data);
};

const insertStockIn = async (data: StockIn): Promise<StockIn> => {
    return await SecureFetch.post(`${API_URL}${prefix}/insertStockIn`, data);
};

const updateStockInBy = async (data: StockIn): Promise<StockIn> => {
    return await SecureFetch.post(`${API_URL}${prefix}/updateStockInBy`, data);
};

const deleteStockInBy = (data: { stock_in_id: string }): Promise<StockIn> => {
    return SecureFetch.post(`${API_URL}${prefix}/deleteStockInBy`, data);
};

export default function useStockIn() {
    return {
        getStockInBy,
        getStockInByID,
        insertStockIn,
        updateStockInBy,
        deleteStockInBy,
    };
}
