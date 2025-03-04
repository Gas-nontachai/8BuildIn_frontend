import React, { useState } from 'react';
import Swal from 'sweetalert2';

import { Customer } from "@/misc/types";
import { useCustomer } from "@/hooks/hooks"

const { insertCustomer } = useCustomer()

import { Close, UploadFile, VisibilityOff, Visibility } from "@mui/icons-material";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle, Button, TextField, IconButton, Grid, MenuItem, Select, FormControl
} from "@mui/material";

interface Props {
  onClose: () => void;
  onRefresh: () => void;
  open: boolean;
}

const AddCustomer: React.FC<Props> = ({ onClose, open, onRefresh }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const prefix_name = [
    { prefix: "นาย" },
    { prefix: "นาง" },
    { prefix: "นางสาว" }
  ]
  const gender = [
    { prefix: "ชาย" },
    { prefix: "หญิง" },
    { prefix: "อื่นๆ" }
  ]

  const initialState: Customer = {
    customer_id: '',
    customer_prefix: '',
    customer_firstname: '',
    customer_lastname: '',
    customer_email: '',
    customer_phone: '',
    customer_birthday: '',
    customer_gender: '',
    customer_address: ''
  };

  const [customerData, setCustomerData] = useState<Customer>(initialState);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setCustomerData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0]
      setSelectedImage(URL.createObjectURL(file));
      setFiles([file]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await insertCustomer(customerData)
      setCustomerData(initialState)
      setSelectedImage(null)
      Swal.fire({
        title: "สำเร็จ!",
        text: "เพิ่มลูกค้าเรียบร้อยแล้ว",
        icon: "success",
        confirmButtonText: "ตกลง",
      });
      await onClose()
      await onRefresh()
    } catch (error) {
      console.error(error)
    }
  };

  const ClearImg = () => {
    onClose()
    setSelectedImage(null)
  }
  return (
    <Dialog open={open} onClose={ClearImg} fullWidth={true} maxWidth="lg">
      <DialogTitle id="alert-dialog-title">
        เพิ่มลูกค้า
        <IconButton
          edge="end"
          color="inherit"
          onClick={onClose}
          aria-label="close"
          sx={{
            position: 'absolute',
            right: 20,
            top: 8,
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={2}>
              <FormControl fullWidth margin="normal">
                <Select
                  name="customer_gender"
                  size="small"
                  value={customerData.customer_gender}
                  onChange={handleChange}
                  displayEmpty
                >
                  <MenuItem value="" disabled>เพศ</MenuItem>
                  {gender.map((item, index) => (
                    <MenuItem key={index} value={item.prefix}>
                      {item.prefix}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={1}>
              <FormControl fullWidth margin="normal">
                <Select
                  name="customer_prefix"
                  size="small"
                  value={customerData.customer_prefix}
                  onChange={handleChange}
                  displayEmpty
                >
                  <MenuItem value="" disabled>คำนำหน้า</MenuItem>
                  {prefix_name.map((item, index) => (
                    <MenuItem key={index} value={item.prefix}>
                      {item.prefix}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="ชื่อ"
                size="small"
                name="customer_firstname"
                value={customerData.customer_firstname}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="นามสกุล"
                size="small"
                name="customer_lastname"
                value={customerData.customer_lastname}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="วันเกิด"
                size="small"
                name="customer_birthday"
                type="date"
                value={customerData.customer_birthday}
                onChange={handleChange}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="อีเมล"
                size="small"
                name="customer_email"
                value={customerData.customer_email}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="เบอร์โทรศัพท์"
                size="small"
                name="customer_phone"
                value={customerData.customer_phone}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>

            <Grid item xs={12} sm={5}>
              <TextField
                label="ที่อยู่"
                name="customer_address"
                value={customerData.customer_address}
                onChange={handleChange}
                fullWidth
                margin="normal"
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center' }}>
        <Button onClick={handleSubmit} color="success" variant="contained">
          บันทึก
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddCustomer;
