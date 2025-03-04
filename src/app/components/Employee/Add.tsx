import React, { useState } from 'react';
import Swal from 'sweetalert2';

import { Employee } from "@/misc/types";
import { useEmployee } from "@/hooks/hooks"

const { insertEmployee } = useEmployee()

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

const AddEmployee: React.FC<Props> = ({ onClose, open, onRefresh }) => {
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

  const initialState: Employee = {
    employee_id: '',
    employee_username: '',
    employee_password: '',
    employee_prefix: '',
    employee_firstname: '',
    employee_lastname: '',
    employee_email: '',
    employee_phone: '',
    employee_birthday: '',
    employee_gender: '',
    employee_address: '',
    employee_img: '',
    license_id: '',
    addby: '',
    adddate: '',
    updateby: '',
    lastupdate: '',
  };

  const [employeeData, setEmployeeData] = useState<Employee>(initialState);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setEmployeeData((prev) => ({ ...prev, [name]: value }));
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
      await insertEmployee({
        employee: employeeData,
        employee_img: files
      })
      setEmployeeData(initialState)
      setSelectedImage(null)
      Swal.fire({
        title: "สำเร็จ!",
        text: "เพิ่มพนักงานเรียบร้อยแล้ว",
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
        เพิ่มพนักงาน
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
            <Grid item xs={12} sm={8}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth margin="normal">
                    <Select
                      name="employee_gender"
                      size="small"
                      value={employeeData.employee_gender}
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
                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth margin="normal">
                    <Select
                      name="employee_prefix"
                      size="small"
                      value={employeeData.employee_prefix}
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
                    name="employee_firstname"
                    value={employeeData.employee_firstname}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    label="นามสกุล"
                    size="small"
                    name="employee_lastname"
                    value={employeeData.employee_lastname}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="อีเมล"
                    size="small"
                    name="employee_email"
                    value={employeeData.employee_email}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="ชื่อผู้ใช้งาน"
                    size="small"
                    name="employee_username"
                    value={employeeData.employee_username}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="รหัสผ่าน"
                    type={showPassword ? 'text' : 'password'}
                    size="small"
                    name="employee_password"
                    value={employeeData.employee_password}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    InputProps={{
                      endAdornment: (
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="เบอร์โทรศัพท์"
                    size="small"
                    name="employee_phone"
                    value={employeeData.employee_phone}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="วันเกิด"
                    size="small"
                    name="employee_birthday"
                    type="date"
                    value={employeeData.employee_birthday}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="ที่อยู่"
                    name="employee_address"
                    value={employeeData.employee_address}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    multiline
                    rows={3}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={4} container justifyContent="center" alignItems="center">
              <div className='flex justify-center flex-col items-center'>
                {selectedImage ? (
                  <div>
                    <img
                      src={selectedImage}
                      alt="Selected"
                      className="w-64 h-64 rounded-full object-cover"
                    />
                  </div>
                ) : (
                  <img
                    src={employeeData.employee_img || "/default-emp.jpg"}
                    alt="Selected"
                    className='w-64 h-64 rounded-full object-cover'
                  />
                )}
                <div className="mt-2">
                  <label htmlFor="upload-image">
                    <Button
                      variant="contained"
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

export default AddEmployee;
