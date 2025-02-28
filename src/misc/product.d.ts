export type Product = {
    product_id: string;
    product_category_id: string;
    product_name: string;
    product_quantity: string;
    unit_id: string;
    material_id: string;
    product_img: string;
    stock_in_id: string;
    addby?: string;
    adddate?: Date | string;
    updateby?: string;
    lastupdate?: Date | string;
}