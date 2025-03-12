export type PurchaseRequest = {
    pr_id: string;
    pr_status: string;
    pr_note: string;
    product: string;
    material: string;
    addby?: string;
    adddate?: Date | string;
    updateby?: string;
    lastupdate?: Date | string;
}