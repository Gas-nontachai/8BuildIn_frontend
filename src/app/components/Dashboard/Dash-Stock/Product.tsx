"use client"
import React, { useState } from "react";
import {
    Table,
    TableHead,
    TableRow,
    TableBody,
} from "@mui/material";
import { KeyboardArrowUp, KeyboardArrowDown } from "@mui/icons-material";

import { useProduct } from "@/hooks/hooks";

const { getProductBy } = useProduct();

const ProductTableData: React.FC = () => {
    return (
        <div>ProductTable</div>
    )
}
export default ProductTableData