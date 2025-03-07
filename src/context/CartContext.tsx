"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useCart } from '@/hooks/hooks';
import { Cart } from '@/misc/types';
import { AuthProvider } from './AuthContext';

interface CartContextType {
    cartItems: Cart[];
    refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cartItems, setCartItems] = useState<Cart[]>([]);
    const { getCartBy } = useCart();
    const { $profile, accessToken } = AuthProvider();

    const refreshCart = async () => {
        try {
            const { docs } = await getCartBy({
                match: {
                    addby: $profile.employee_id,
                    cart_status: "0"
                }
            });
            setCartItems(docs);
        } catch (error) {
            console.error("Error fetching cart:", error);
        }
    };

    useEffect(() => {
        if (accessToken) {
            refreshCart();
        }
    }, [$profile.employee_id]);

    return (
        <CartContext.Provider value={{ cartItems, refreshCart }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCartContext() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCartContext must be used within a CartProvider');
    }
    return context;
}