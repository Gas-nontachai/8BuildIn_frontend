export type StockOut = {
    stock_out_id: string;
    order_id: string;
    product: string;
    material: string;
    stock_out_date: Date | string;
    stock_out_note: string;
    addby: string;
    adddate: Date | string;
}