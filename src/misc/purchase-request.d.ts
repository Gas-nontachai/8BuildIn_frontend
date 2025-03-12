export type PurchaseRequest = {
    pr_id: string;
    product: string;
    material: string;
    pr_states: string;
    pr_note: string;
    addby?: string;
    adddate?: Date | string;
    updateby?: string;
    lastupdate?: Date | string;
}