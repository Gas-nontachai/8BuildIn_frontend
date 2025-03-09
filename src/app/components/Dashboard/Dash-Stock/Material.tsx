"use client"
import React, { useState, useEffect } from "react";
import {
    Table,
    TableHead,
    TableRow,
    TableBody,
    TableCell,
    Paper,
    TableContainer,
    CircularProgress,
} from "@mui/material";
import { KeyboardArrowUp, KeyboardArrowDown } from "@mui/icons-material";
import { useMaterial } from "@/hooks/hooks";
import { Material } from "@/misc/types";

const MaterialTableData: React.FC = () => {
    const [materials, setMaterials] = useState<Material[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const { getMaterialBy } = useMaterial();

    useEffect(() => {
        fetchMaterials();
    }, []);

    const fetchMaterials = async () => {
        try {
            const response = await getMaterialBy({});
            setMaterials(response.docs);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching materials:", error);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[400px]">
                <CircularProgress />
            </div>
        );
    }

    return (
        <div className="w-full p-4">
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow className="bg-gray-100">
                            <TableCell>รหัสวัตถุดิบ</TableCell>
                            <TableCell>ชื่อวัตถุดิบ</TableCell>
                            <TableCell>หมวดหมู่</TableCell>
                            <TableCell>จำนวน</TableCell>
                            <TableCell>ราคา</TableCell>
                            <TableCell>หน่วย</TableCell>
                            <TableCell>วันที่เพิ่ม</TableCell>
                            <TableCell>วันที่อัพเดท</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {materials.map((material) => (
                            <TableRow key={material.material_id}>
                                <TableCell>{material.material_id}</TableCell>
                                <TableCell>{material.material_name}</TableCell>
                                <TableCell>{material.material_category_id}</TableCell>
                                <TableCell>{material.material_quantity}</TableCell>
                                <TableCell>{material.material_price}</TableCell>
                                <TableCell>{material.unit_id}</TableCell>
                                <TableCell>
                                    {material.adddate ? new Date(material.adddate).toLocaleDateString('th-TH') : '-'}
                                </TableCell>
                                <TableCell>
                                    {material.lastupdate ? new Date(material.lastupdate).toLocaleDateString('th-TH') : '-'}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default MaterialTableData;