export type Customer = {
    customer_id: string;
    customer_prefix: string;
    customer_firstname: string;
    customer_lastname: string;
    customer_email: string;
    customer_phone: string;
    customer_birthday: string;
    customer_gender: string;
    customer_address: string;
    addby: string;
    adddate: Date | string;
    updateby: string;
    lastupdate: Date | string;
}