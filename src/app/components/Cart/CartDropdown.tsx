"use client";
import { useState } from "react";
import { ListItemSecondaryAction, Avatar, ListItemAvatar, Popover, Box, Typography, IconButton, Badge, List, ListItem, ListItemText, Divider, Button } from "@mui/material";
import { ShoppingBag } from "@mui/icons-material";

interface CartItem {
    id: number;
    name: string;
    img: string;
    price: number;
    quantity: number;
}

const sampleCartItems: CartItem[] = [
    {
        id: 1,
        name: "สินค้า A",
        img: "https://via.placeholder.com/50",
        price: 500,
        quantity: 2
    },
    ...Array(12).fill(null).map((_, index) => ({
        id: 2 + index,
        name: "สินค้า B",
        img: `https://via.placeholder.com/50?text=B${index + 1}`,
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
                    <span className="text-gray-700 text-[17px] font-[400]">ตะกร้าสินค้า</span>
                    <List sx={{ maxHeight: 300, overflow: "auto" }}>
                        {sampleCartItems.slice(0, 3).map((item) => (
                            <Box key={item.id}>
                                <ListItem>
                                    <img src={item.img} className="w-10 h-10 runded-sm mr-2" alt="" />
                                    <div className="flex-1">
                                        <p className="text-[14px] font-[500] text-gray-700">{item.name}</p>
                                        <p className="text-sm text-gray-500">x {item.quantity}</p>
                                    </div>
                                    <div className="flex-shrink-0">
                                        <p className="text-[15px] font-[400] text-gray-700">
                                            ฿{item.price}
                                        </p>
                                    </div>
                                </ListItem>
                                <Divider />
                            </Box>
                        ))}

                        {sampleCartItems.length > 5 && (
                            <div className="flex justify-between mt-2">
                                <span className="text-gray-700 text-[13px] mt-4">
                                    {sampleCartItems.length} สินค้าเพิ่มเติมในตะกร้า
                                </span>
                                <Button variant="contained" color="info">
                                    ดูตะกร้าสินค้า
                                </Button>
                            </div>
                        )}
                    </List>
                </Box>
            </Popover>
        </>
    );
}
