"use client";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { styled } from "@mui/material/styles";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import { MenuItem, Menu } from "@mui/material";
import { Logout, PersonOutlined } from "@mui/icons-material";
import { AuthProvider } from "@/context/AuthContext";
import CartDropdown from "./Cart/CartDropdown";

const drawerWidth = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export default function Navbar({ open, setOpen }: { open: boolean; setOpen: (value: boolean) => void }) {
  const { $profile } = AuthProvider()
  const pathname = usePathname();
  const router = useRouter()
  const { logout } = AuthProvider();
  const [anchorEl, setAnchorEl] = useState(null);

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
            <Box sx={{ display: "flex", alignItems: "center", ml: "auto" }}>
              <CartDropdown />
            </Box>
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
            <AccountCircleIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            <MenuItem onClick={() => router.push(`/profile?id=${$profile.employee_id}`)}>
              <PersonOutlined sx={{ mr: 1 }} />
              <Typography>โปรไฟล์</Typography>
            </MenuItem>
            <MenuItem onClick={() => logout()}>
              <Logout sx={{ mr: 1 }} />
              <Typography>ออกจากระบบ</Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
