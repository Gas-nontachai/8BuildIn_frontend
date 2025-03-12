"use client";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { styled } from "@mui/material/styles";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";

import {
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Box,
  MenuItem,
  Menu,
} from "@mui/material";

import {
  Menu as MenuIcon,
  Mail as MailIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  Logout,
  PersonOutlined,
  LockOpenOutlined
} from "@mui/icons-material";

import { AuthProvider } from "@/context/AuthContext";
import { API_URL } from "@/utils/config";
import ChangePassword from "./Auth/ChangePassword";
import CartDropdown from "@/app/components/Sales/Cart/CartDropdown";

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
}));

export default function Navbar({ open, setOpen }: { open: boolean; setOpen: (value: boolean) => void }) {
  const { $profile } = AuthProvider();
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = AuthProvider();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openChangePassword, setOpenChangePassword] = useState(false);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <AppBar position="fixed" open={open} sx={{ backgroundColor: "#262626" }}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={() => setOpen(true)}
          edge="start"
          sx={{ mr: 2, ...(open && { display: "none" }) }}
        >
          <MenuIcon />
        </IconButton>
        {!open && (
          <Typography variant="h6" noWrap component="div">
            <img src="/logo.jpg" alt="Logo" className="rounded-md" style={{ width: "auto", height: "40px" }} />
          </Typography>
        )}
        <Box sx={{ display: "flex", alignItems: "center", ml: "auto" }}>
          {pathname.includes("/sales") && (
            <>
              <CartDropdown />
            </>
          )}
          <IconButton color="inherit" sx={{ ml: 2 }}>
            <Badge showZero={false}>
              <MailIcon />
            </Badge>
          </IconButton>
          <IconButton color="inherit" sx={{ ml: 2 }}>
            <Badge showZero={false}>
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton color="inherit" sx={{ ml: 2 }} onClick={handleClick}>
            {$profile.employee_img ? (
              <img
                className="w-9 h-9 rounded-full"
                src={`${API_URL}${$profile.employee_img}`}
                alt="img_profile"
              />
            ) : (
              <AccountCircleIcon className="w-9 h-9" />
            )}
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            <MenuItem onClick={() => {
              router.push(`/profile?id=${$profile.employee_id}`);
              setAnchorEl(null);
            }}>
              <PersonOutlined sx={{ mr: 1 }} />
              <Typography>โปรไฟล์</Typography>
            </MenuItem>
            <MenuItem onClick={() => {
              setOpenChangePassword(true);
              setAnchorEl(null);
            }}>
              <LockOpenOutlined sx={{ mr: 1 }} />
              <Typography>เปลี่ยนรหัสผ่าน</Typography>
            </MenuItem>

            <MenuItem onClick={() => {
              logout();
              setAnchorEl(null);
            }}>
              <Logout sx={{ mr: 1 }} />
              <Typography>ออกจากระบบ</Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>

      <ChangePassword
        open={openChangePassword}
        onClose={() => setOpenChangePassword(false)}
        employee_id={$profile.employee_id}
      />
    </AppBar>
  );
}