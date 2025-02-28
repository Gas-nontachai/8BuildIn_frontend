import { API_URL } from '@/utils/api_url';
import axiosInstance from '@/utils/axiosInstance';
import { MaterialCategory } from '@/misc/types'

const prefix = 'materialcategory-category';

const getMaterialCategoryBy = (data: any = {}): Promise<{ docs: MaterialCategory[], totalDocs: number }> => {
    return axiosInstance.post(`${API_URL}${prefix}/getMaterialCategoryBy`, data);
};

const getMaterialCategoryByID = (data: { materialcategory_id: string }): Promise<MaterialCategory> => {
    return axiosInstance.post(`${API_URL}${prefix}/getMaterialCategoryByID`, data);
};

const insertMaterialCategory = async (data: MaterialCategory): Promise<MaterialCategory> => {
    return await axiosInstance.post(`${API_URL}${prefix}/insertMaterialCategory`, data);
};

const updateMaterialCategoryBy = async (data: MaterialCategory): Promise<MaterialCategory> => {
    return await axiosInstance.post(`${API_URL}${prefix}/updateMaterialCategoryBy`, data);
};

const deleteMaterialCategoryBy = (data: { materialcategory_id: string }): Promise<MaterialCategory> => {
    return axiosInstance.post(`${API_URL}${prefix}/deleteMaterialCategoryBy`, data);
};

export default function useMaterialCategory() {
    return {
        getMaterialCategoryBy,
        getMaterialCategoryByID,
        insertMaterialCategory,
        updateMaterialCategoryBy,
        deleteMaterialCategoryBy,
    };
}
