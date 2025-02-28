export type StockIn = {
    stock_in_id: string;
    product: string;
    material: string;
    stock_in_price: string;
    supplier_id: string;
    stock_in_date: Date | string;
    addby: string;
    adddate: Date | string;
}