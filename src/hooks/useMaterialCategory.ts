import { API_URL } from '@/utils/config';
import { SecureFetch, formData } from '@/utils/fetch';
import { MaterialCategory } from '@/misc/types'

const prefix = 'material-category';

const getMaterialCategoryBy = (data: any = {}): Promise<{ docs: MaterialCategory[], totalDocs: number }> => {
    return SecureFetch.post(`${API_URL}${prefix}/getMaterialCategoryBy`, data);
};

const getMaterialCategoryByID = (data: { material_category_id: string }): Promise<MaterialCategory> => {
    return SecureFetch.post(`${API_URL}${prefix}/getMaterialCategoryByID`, data);
};

const insertMaterialCategory = async (data: MaterialCategory): Promise<MaterialCategory> => {
    return await SecureFetch.post(`${API_URL}${prefix}/insertMaterialCategory`, data);
};

const updateMaterialCategoryBy = async (data: MaterialCategory): Promise<MaterialCategory> => {
    return await SecureFetch.post(`${API_URL}${prefix}/updateMaterialCategoryBy`, data);
};

const deleteMaterialCategoryBy = (data: { material_category_id: string }): Promise<MaterialCategory> => {
    return SecureFetch.post(`${API_URL}${prefix}/deleteMaterialCategoryBy`, data);
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
