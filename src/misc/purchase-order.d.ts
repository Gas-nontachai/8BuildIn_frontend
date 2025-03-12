export type PurchaseOrder = {
    po_id: string;
    pr_id: string;
    supplier_id: string;
    po_status: string;
    po_note: string;
    addby?: string;
    adddate?: Date | string;
    updateby?: string;
    lastupdate?: Date | string;
}