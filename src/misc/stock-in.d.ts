export type StockIn = {
    stock_in_id: string;
    po_id: string;
    product: string;
    material: string;
    stock_in_price: number;
    stock_in_note: string;
    supplier_id: string;
    addby?: string;
    adddate?: Date | string;
}