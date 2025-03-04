export type Employee = {
    employee_id: string;
    employee_username: string;
    employee_password: string;
    employee_prefix: string;
    employee_firstname: string;
    employee_lastname: string;
    employee_email: string;
    employee_phone: string;
    employee_birthday: string;
    employee_gender: string;
    employee_address: string;
    employee_img: string;
    license_id: string;
    addby?: string;
    adddate?: Date | string;
    updateby?: string;
    lastupdate?: Date | string;
};
