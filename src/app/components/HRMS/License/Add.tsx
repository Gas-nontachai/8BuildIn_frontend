import React, { useState } from 'react';
import Swal from 'sweetalert2';

import { License } from "@/misc/types";
import { useLicense } from "@/hooks/hooks"

const { insertLicense } = useLicense()

import { Close } from "@mui/icons-material";
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

const AddLicense: React.FC<Props> = ({ onClose, open, onRefresh }) => {
  const initialState: License = {
    license_id: '',
    license_name: ''
  };

  const [licenseData, setLicenseData] = useState<License>(initialState);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setLicenseData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await insertLicense(licenseData)
      setLicenseData(initialState)
      Swal.fire({
        title: "สำเร็จ!",
        text: "เพิ่มบทบาทเรียบร้อยแล้ว",
        icon: "success",
        confirmButtonText: "ตกลง",
      });
      await onClose()
      await onRefresh()
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <Dialog open={open} onClose={onClose} fullWidth={true} maxWidth="xs">
      <DialogTitle id="alert-dialog-title">
        เพิ่มบทบาท
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
          <Grid item xs={12} sm={3}>
            <Grid item xs={12} sm={3}>
              <TextField
                label="ชื่อบทบาท"
                size="small"
                name="license_name"
                value={licenseData.license_name}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
          </Grid>
        </form>
      </DialogContent >
      <DialogActions sx={{ justifyContent: 'center' }}>
        <Button onClick={handleSubmit} color="success" variant="contained">
          บันทึก
        </Button>
      </DialogActions>
    </Dialog >
  );
};

export default AddLicense;
