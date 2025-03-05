import { API_URL } from '@/utils/config';
import {SecureFetch,formData} from '@/utils/fetch';
import { License } from '@/misc/types'

const prefix = 'license';

const getLicenseBy = (data: any = {}): Promise<{ docs: License[], totalDocs: number }> => {
    return SecureFetch.post(`${API_URL}${prefix}/getLicenseBy`, data);
};

const getLicenseByID = (data: { license_id: string }): Promise<License> => {
    return SecureFetch.post(`${API_URL}${prefix}/getLicenseByID`, data);
};

const insertLicense = async (data: License): Promise<License> => {
    return await SecureFetch.post(`${API_URL}${prefix}/insertLicense`, data);
};

const updateLicenseBy = async (data: License): Promise<License> => {
    return await SecureFetch.post(`${API_URL}${prefix}/updateLicenseBy`, data);
};

const deleteLicenseBy = (data: { license_id: string }): Promise<License> => {
    return SecureFetch.post(`${API_URL}${prefix}/deleteLicenseBy`, data);
};

export default function useLicense() {
    return {
        getLicenseBy,
        getLicenseByID,
        insertLicense,
        updateLicenseBy,
        deleteLicenseBy,
    };
}
