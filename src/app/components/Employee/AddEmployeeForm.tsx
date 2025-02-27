import React, { useState } from 'react';
import { Employee } from "@/types/types";
import { Close } from "@mui/icons-material";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, IconButton, Grid, MenuItem, Select, FormControl, InputLabel } from "@mui/material";

interface AddEmployeeFormProps {
  onClose: () => void;
  open: boolean;
}

const AddEmployeeForm: React.FC<AddEmployeeFormProps> = ({ onClose, open }) => {
  const prefix_name = [
    { prefix: "นาย" },
    { prefix: "นาง" },
    { prefix: "นางสาว" }
  ]

  const [employeeData, setEmployeeData] = useState<Employee>({
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
    license_id: '',
    addby: '',
    adddate: '',
    updateby: '',
    lastupdate: '',
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setEmployeeData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // onSubmit(employeeData);
    console.log("Form submitted with data:", employeeData);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth={true} maxWidth="md" >
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
            <Grid item xs={12} sm={6}>
              <TextField
                label="ชื่อผู้ใช้"
                name="employee_username"
                value={employeeData.employee_username}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>คำนำหน้า</InputLabel>
                <Select
                  name="employee_prefix"
                  value={employeeData.employee_prefix}
                  onChange={handleChange}
                >
                  {prefix_name.map((item, index) => (
                    <MenuItem key={index} value={item.prefix}>
                      {item.prefix}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="ชื่อ"
                name="employee_firstname"
                value={employeeData.employee_firstname}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="นามสกุล"
                name="employee_lastname"
                value={employeeData.employee_lastname}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="อีเมล"
                name="employee_email"
                value={employeeData.employee_email}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="เบอร์โทรศัพท์"
                name="employee_phone"
                value={employeeData.employee_phone}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="วันเกิด"
                name="employee_birthday"
                type="date"
                value={employeeData.employee_birthday}
                onChange={handleChange}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="เพศ"
                name="employee_gender"
                value={employeeData.employee_gender}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="ที่อยู่"
                name="employee_address"
                value={employeeData.employee_address}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="เลขที่ใบอนุญาต"
                name="license_id"
                value={employeeData.license_id}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button type="submit" color="primary" onClick={handleSubmit}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEmployeeForm;
