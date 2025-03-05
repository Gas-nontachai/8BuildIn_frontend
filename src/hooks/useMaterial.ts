import { API_URL } from '@/utils/config';
import { SecureFetch } from '@/utils/fetch';
import { Material } from '@/misc/types'

const prefix = 'material';

const getMaterialBy = (data: any = {}): Promise<{ docs: Material[], totalDocs: number }> => {
    return SecureFetch.post(`${API_URL}${prefix}/getMaterialBy`, data);
};

const getMaterialByID = (data: { material_id: string }): Promise<Material> => {
    return SecureFetch.post(`${API_URL}${prefix}/getMaterialByID`, data);
};

const insertMaterial = async (data: Material): Promise<Material> => {
    return await SecureFetch.post(`${API_URL}${prefix}/insertMaterial`, data);
};

const updateMaterialBy = async (data: Material): Promise<Material> => {
    return await SecureFetch.post(`${API_URL}${prefix}/updateMaterialBy`, data);
};

const deleteMaterialBy = (data: { material_id: string }): Promise<Material> => {
    return SecureFetch.post(`${API_URL}${prefix}/deleteMaterialBy`, data);
};

export default function useMaterial() {
    return {
        getMaterialBy,
        getMaterialByID,
        insertMaterial,
        updateMaterialBy,
        deleteMaterialBy,
    };
}
