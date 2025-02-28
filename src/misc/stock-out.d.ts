export type StockOut = {
    stock_out_id: string;
    product: string;
    material: string;
    stock_out_date: Date | string;
    addby: string;
    adddate: Date | string;
}