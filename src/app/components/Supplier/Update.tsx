import { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import { API_URL } from '@/utils/config';
import { Close, DeleteForeverRounded, Add, UploadFile } from "@mui/icons-material";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    TextField,
    IconButton,
    Grid,
    FormControl,
    Select,
    MenuItem,
    FormLabel,
    CircularProgress
} from "@mui/material";

import useSupplier from "@/hooks/useSupplier";
import { Supplier } from '@/misc/types';
const { getSupplierByID, updateSupplierBy } = useSupplier();

interface UpdateSupplierProps {
    onClose: () => void;
    onRefresh: () => void;
    open: boolean;
    supplier_id: string;
}

const UpdateSupplier: React.FC<UpdateSupplierProps> = ({ onClose, onRefresh, open, supplier_id }) => {
    const [data, setData] = useState<Supplier | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [name, setName] = useState<string>("");
    const [contacts, setContacts] = useState<{ type: string, value: string }[]>([]);
    const [files, setFiles] = useState<File[]>([]);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const option_contact = ['โทรศัพท์', 'อีเมล', 'ที่อยู่'];

    const handleContactChange = (index: number, value: string) => {
        const updatedContacts = [...contacts];
        updatedContacts[index].value = value;
        setContacts(updatedContacts);
    };

    const handleTypeChange = (index: number, type: string) => {
        const updatedContacts = [...contacts];
        updatedContacts[index].type = type;
        setContacts(updatedContacts);
    };

    const handleAddContact = () => {
        setContacts([...contacts, { type: "", value: "" }]);
    };

    const handleRemoveContact = (index: number) => {
        const updatedContacts = contacts.filter((_, i) => i !== index);
        setContacts(updatedContacts);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0]
            setSelectedImage(URL.createObjectURL(file));
            setFiles([file]);
        }
    };

    const handleSubmit = async () => {
        try {
            await onClose();
            Swal.fire({
                icon: 'info',
                title: 'กำลังดำเนินการ...',
                text: 'กรุณารอสักครู่',
                showConfirmButton: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });
            const supplierData: Supplier = {
                supplier_id: supplier_id,
                supplier_name: name,
                supplier_contact: JSON.stringify(contacts),
                supplier_img: ""
            };
            await updateSupplierBy({
                supplier: supplierData,
                supplier_img: files.length > 0 ? files : undefined
            });
            setSelectedImage(null)
            await onRefresh();
            Swal.fire({
                icon: 'success',
                title: 'สำเร็จ!',
                text: 'ข้อมูลผู้จำหน่ายได้รับการอัปเดตแล้ว',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2000,
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: 'ไม่สามารถอัปเดตข้อมูลผู้จำหน่ายได้',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2000,
            });
        }
    };

    useEffect(() => {
        if (open && supplier_id) {
            fetchData();
        }
    }, [open, supplier_id]);

    const fetchData = async () => {
        try {
            setLoading(true)
            const res = await getSupplierByID({ supplier_id });
            setData(res);
            setContacts(JSON.parse(res.supplier_contact))
            setName(res.supplier_name)
        } catch (error) {
            console.error("Error fetching supplier data:", error);
            Swal.fire("Error", "ไม่สามารถดึงข้อมูลผู้จำหน่ายได้", "error");
        }
        setLoading(false)
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>
                แก้ไขข้อมูลผู้จำหน่าย
                <IconButton onClick={onClose} style={{ position: "absolute", right: 10, top: 10 }}>
                    <Close />
                </IconButton>
            </DialogTitle>
            {loading ? (
                <div className="flex justify-center flex-col items-center text-[15px] mb-3" >
                    <CircularProgress />
                    <span> กำลังโหลดข้อมูล...</span>
                </div>
            ) : (
                <DialogContent sx={{ p: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={9}>
                            <FormLabel component="legend" className="mb-2">ชื่อผู้จำหน่าย <span className="text-red-500">*</span></FormLabel>
                            <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <div className='flex justify-center flex-col items-center'>
                                <FormLabel component="legend" className="mb-2">โลโก้ผู้จัดจำหน่าย (ถ้ามี)</FormLabel>
                                {selectedImage ? (
                                    <div>
                                        {loading ? (
                                            <CircularProgress />
                                        ) : (
                                            <img
                                                src={selectedImage || `${API_URL}${data?.supplier_img}`}
                                                alt="Selected"
                                                className="w-32 h-32 rounded-md object-cover border-2"
                                            />
                                        )}
                                    </div>
                                ) : (
                                    <img
                                        src={`${API_URL}${data?.supplier_img}` || "default-emp.jpg"}
                                        alt="Selected"
                                        className='w-32 h-32 rounded-md object-cover'
                                    />
                                )}
                                <div className="mt-2">
                                    <label htmlFor="upload-image">
                                        <Button
                                            variant="contained"
                                            size="small"
                                            component="span"
                                            color="primary"
                                            startIcon={<UploadFile />}
                                        >
                                            เลือกไฟล์
                                        </Button>
                                    </label>
                                    <input
                                        id="upload-image"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />
                                </div>
                            </div>
                        </Grid>
                        {contacts.map((contact, index) => (
                            <Grid item xs={12} key={index}>
                                <Grid container spacing={2}>
                                    <Grid item xs={5}>
                                        <FormControl fullWidth>
                                            <Select
                                                value={contact.type}
                                                onChange={(e) => handleTypeChange(index, e.target.value)}
                                                size="small"
                                                displayEmpty
                                            >
                                                <MenuItem value="" disabled>ประเภทการติดต่อ</MenuItem>
                                                {option_contact.map((option) => (
                                                    <MenuItem key={option} value={option}>{option}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            label="ข้อมูลติดต่อ"
                                            size="small"
                                            fullWidth
                                            value={contact.value}
                                            onChange={(e) => handleContactChange(index, e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={1}>
                                        <IconButton onClick={() => handleRemoveContact(index)} color="error">
                                            <DeleteForeverRounded />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            </Grid>
                        ))}
                        <Grid item xs={12}>
                            <Button onClick={handleAddContact} startIcon={<Add />} color="primary">
                                เพิ่มช่องติดต่อ
                            </Button>
                        </Grid>
                    </Grid>
                </DialogContent>
            )}
            <DialogActions sx={{ justifyContent: "center" }}>
                <Button onClick={handleSubmit} color="success" variant="contained">
                    บันทึก
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UpdateSupplier;