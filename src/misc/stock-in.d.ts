export type StockIn = {
    stock_in_id: string;
    product: string;
    material: string;
    stock_in_price: number;
    supplier_id: string;
    supplier_note: string;
    addby: string;
    adddate: Date | string;
}