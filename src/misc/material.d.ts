export type Material = {
    material_id: string;
    material_name: string;
    material_quantity: string;
    material_price: string;
    unit_id: string;
    material_img: string;
    stock_in_id: string;
    addby?: string;
    adddate?: Date | string;
    updateby?: string;
    lastupdate?: Date | string;
}