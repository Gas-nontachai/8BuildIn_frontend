export type Product = {
    product_id: string;
    product_category_id: string;
    product_name: string;
    product_quantity: string;
    product_price: number;
    unit_id: string;
    material: string;
    product_img: string;
    stock_in_id: string;
    addby?: string;
    adddate?: Date | string;
    updateby?: string;
    lastupdate?: Date | string;
}