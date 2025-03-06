export type Cart = {
    cart_id: string,
    cart_amount: string,
    cart_status: string,
    product_id: string,
    addby?: string,
    adddate?: string
};


interface CartItemWithProduct extends Cart {
    product?: {
        product_id: string;
        product_name: string;
        product_price: number; // เปลี่ยนจาก string เป็น number
        product_img: string;
        product_quantity: string;
    }
}