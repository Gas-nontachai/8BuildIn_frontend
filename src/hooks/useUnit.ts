import { API_URL } from '@/utils/config';
import {preSecureFetch,formData} from '@/utils/fetch';
import { Unit } from '@/misc/types'

const prefix = 'unit';

const getUnitBy = (data: any = {}): Promise<{ docs: Unit[], totalDocs: number }> => {
    return preSecureFetch.post(`${API_URL}${prefix}/getUnitBy`, data);
};

const getUnitByID = (data: { unit_id: string }): Promise<Unit> => {
    return preSecureFetch.post(`${API_URL}${prefix}/getUnitByID`, data);
};

const insertUnit = async (data: Unit): Promise<Unit> => {
    return await preSecureFetch.post(`${API_URL}${prefix}/insertUnit`, data);
};

const updateUnitBy = async (data: Unit): Promise<Unit> => {
    return await preSecureFetch.post(`${API_URL}${prefix}/updateUnitBy`, data);
};

const deleteUnitBy = (data: { unit_id: string }): Promise<Unit> => {
    return preSecureFetch.post(`${API_URL}${prefix}/deleteUnitBy`, data);
};

export default function useUnit() {
    return {
        getUnitBy,
        getUnitByID,
        insertUnit,
        updateUnitBy,
        deleteUnitBy,
    };
}
