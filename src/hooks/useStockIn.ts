import { API_URL } from '@/utils/config';
import axiosInstance from '@/utils/fetch';
import { StockIn } from '@/misc/types'

const prefix = 'stockin-category';

const getStockInBy = (data: any = {}): Promise<{ docs: StockIn[], totalDocs: number }> => {
    return axiosInstance.post(`${API_URL}${prefix}/getStockInBy`, data);
};

const getStockInByID = (data: { stockin_id: string }): Promise<StockIn> => {
    return axiosInstance.post(`${API_URL}${prefix}/getStockInByID`, data);
};

const insertStockIn = async (data: StockIn): Promise<StockIn> => {
    return await axiosInstance.post(`${API_URL}${prefix}/insertStockIn`, data);
};

const updateStockInBy = async (data: StockIn): Promise<StockIn> => {
    return await axiosInstance.post(`${API_URL}${prefix}/updateStockInBy`, data);
};

const deleteStockInBy = (data: { stockin_id: string }): Promise<StockIn> => {
    return axiosInstance.post(`${API_URL}${prefix}/deleteStockInBy`, data);
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
