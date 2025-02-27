import { useState } from "react";
import Link from "next/link";
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Collapse, IconButton, Divider } from "@mui/material";
import { ExpandLess, ExpandMore, Factory as FactoryIcon, Group as GroupIcon, AccountCircle as AccountIcon, Task as TaskIcon, Store as StoreIcon, Equalizer as EqualizerIcon, AttachMoney as AttachMoneyIcon } from "@mui/icons-material";

export default function SidebarMenu() {
    const [openFac, setOpenFac] = useState(false);
    const [openEmp, setOpenEmp] = useState(false);
    const [openAcc, setOpenAcc] = useState(false);

    const Factory = [
        { text: "Factory Dashboard", href: "/dash-fac", icon: <FactoryIcon /> },
        { text: "Production", href: "/production", icon: <StoreIcon /> },
        { text: "Maintenance", href: "/maintenance", icon: <StoreIcon /> }
    ];
    const Employee = [
        { text: "Employee Dashboard", href: "/dash-em", icon: <GroupIcon /> },
        { text: "Employee Profiles", href: "/employee-profiles", icon: <GroupIcon /> },
        { text: "Attendance", href: "/attendance", icon: <TaskIcon /> }
    ];
    const Account = [
        { text: "Account Dashboard", href: "/dash-acc", icon: <AccountIcon /> },
        { text: "Billing", href: "/billing", icon: <AttachMoneyIcon /> },
        { text: "Transaction History", href: "/transaction-history", icon: <AttachMoneyIcon /> }
    ];

    const MenuList = [
        { text: "Tasks", href: "/tasks", icon: <TaskIcon /> },
        { text: "Stock Store", href: "/stock-store", icon: <StoreIcon /> },
        { text: "KPI", href: "/kpi", icon: <EqualizerIcon /> },
        { text: "Sales", href: "/sales", icon: <AttachMoneyIcon /> }
    ];

    return (
        <List>
            {MenuList.map((item) => (
                <ListItem key={item.text} disablePadding>
                    <ListItemButton component="a" href={item.href}>
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItemButton>
                </ListItem>
            ))}
            <ListItem disablePadding>
                <ListItemButton onClick={() => setOpenFac(!openFac)}>
                    <ListItemText primary="จัดการโรงงาน" />
                    <IconButton edge="end">
                        {openFac ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                </ListItemButton>
            </ListItem>
            <Collapse in={openFac} timeout="auto" unmountOnExit>
                {Factory.map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <Link href={item.href} passHref legacyBehavior>
                            <ListItemButton component="a">
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItemButton>
                        </Link>
                    </ListItem>
                ))}
                <Divider />
            </Collapse>

            {/* Manage Emp */}
            <ListItem disablePadding>
                <ListItemButton onClick={() => setOpenEmp(!openEmp)}>
                    <ListItemText primary="จัดการพนักงาน" />
                    <IconButton edge="end">
                        {openEmp ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                </ListItemButton>
            </ListItem>
            <Collapse in={openEmp} timeout="auto" unmountOnExit>
                {Employee.map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <Link href={item.href} passHref legacyBehavior>
                            <ListItemButton component="a">
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItemButton>
                        </Link>
                    </ListItem>
                ))}
                <Divider />
            </Collapse>

            {/* Manage Acc */}
            <ListItem disablePadding>
                <ListItemButton onClick={() => setOpenAcc(!openAcc)}>
                    <ListItemText primary="จัดการบัญชี" />
                    <IconButton edge="end">
                        {openAcc ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                </ListItemButton>
            </ListItem>
            <Collapse in={openAcc} timeout="auto" unmountOnExit>
                {Account.map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <Link href={item.href} passHref legacyBehavior>
                            <ListItemButton component="a">
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItemButton>
                        </Link>
                    </ListItem>
                ))}
                <Divider />
            </Collapse>
        </List>
    );
}
