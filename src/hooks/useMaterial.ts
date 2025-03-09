import { API_URL } from '@/utils/config';
import { SecureFetch, formData } from '@/utils/fetch';
import { Material } from '@/misc/types'

const prefix = 'material';

const getMaterialBy = (data: any = {}): Promise<{ docs: Material[], totalDocs: number }> => {
    return SecureFetch.post(`${API_URL}${prefix}/getMaterialBy`, data);
};

const getMaterialByID = (data: { material_id: string }): Promise<Material> => {
    return SecureFetch.post(`${API_URL}${prefix}/getMaterialByID`, data);
};

const insertMaterial = async (data: { material: Material, material_img?: File[] }): Promise<Material> => {
    const formDataInstance = new FormData();
    formDataInstance.append("material", JSON.stringify(data.material));

    if (data.material_img && data.material_img.length > 0) {
        data.material_img.forEach((file, index) => {
            formDataInstance.append(`material_img_${index}`, file);
        });
    }

    return await formData.post(`${API_URL}${prefix}/insertMaterial`, formDataInstance);
};

const updateMaterialBy = async (data: { material: Material, material_img?: File[] }): Promise<Material> => {
    const formDataInstance = new FormData();
    formDataInstance.append("material", JSON.stringify(data.material));

    if (data.material_img && data.material_img.length > 0) {
        data.material_img.forEach((file, index) => {
            formDataInstance.append(`material_img_${index}`, file);
        });
    }

    return await formData.post(`${API_URL}${prefix}/updateMaterialBy`, formDataInstance);
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
