"use client";
import { useState } from "react";
import { Popover, Box, Typography, IconButton, Badge, List, ListItem, ListItemText, Divider, Button } from "@mui/material";
import { ShoppingBag } from "@mui/icons-material";

interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
}

const sampleCartItems: CartItem[] = [
    { id: 1, name: "สินค้า A", price: 500, quantity: 2 },
    ...Array(12).fill(null).map((_, index) => ({
        id: 2 + index,
        name: "สินค้า B",
        price: 350,
        quantity: 1
    }))
];


export default function CartDropdown() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <button
                className="relative p-2 hover:bg-[#333333] rounded-md transition-transform hover:scale-110"
                onClick={handleClick}
            >
                {sampleCartItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-[500] rounded-full w-5 h-5 flex items-center justify-center">
                        {sampleCartItems.length}
                    </span>
                )}
                <ShoppingBag className="text-white text-2xl" />
            </button>

            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Box sx={{ width: 350, p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        ตะกร้าสินค้า
                    </Typography>
                    <List sx={{ maxHeight: 250, overflow: "auto" }}>
                        {sampleCartItems.map((item) => (
                            <Box key={item.id}>
                                <ListItem>
                                    <ListItemText primary={item.name} secondary={`฿${item.price} x ${item.quantity}`} />
                                </ListItem>
                                <Divider />
                            </Box>
                        ))}
                    </List>
                    <Button fullWidth size="small" variant="contained" color="primary" sx={{ mt: 2 }}>
                        ไปที่ตะกร้า
                    </Button>
                </Box>
            </Popover>
        </>
    );
}
