"use client";
import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { MenuOpen } from "@mui/icons-material/";
import Menu from "./Menu";
import Navbar from "./Navbar";

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
    open?: boolean;
}>(({ theme }) => ({
    flexGrow: 1,
    padding: theme.spacing(3)
}));

const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
}));

export default function Sidebar({ open, setOpen }: { open: boolean; setOpen: (value: boolean) => void }) {
    const theme = useTheme();

    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline />
            <Navbar open={open} setOpen={setOpen} />
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: drawerWidth,
                        boxSizing: "border-box",
                    },
                }}
                variant="persistent"
                anchor="left"
                open={open}
            >
                <DrawerHeader>
                    <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
                        <img
                            src="/logo.jpg"
                            alt="Logo"
                            className="rounded-md"
                            style={{ width: "auto", height: "40px" }}
                        />
                    </Box>
                    <IconButton onClick={() => setOpen(!open)}>
                        {theme.direction === "ltr" ? <MenuOpen /> : <ChevronRightIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <Menu />
            </Drawer>
            <Main open={open}>
                <DrawerHeader />
            </Main>
        </Box>
    );
}
