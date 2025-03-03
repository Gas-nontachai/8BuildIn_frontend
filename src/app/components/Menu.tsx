import { useState } from "react";
import Link from "next/link";
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Collapse, IconButton, Divider } from "@mui/material";
import {
    Home as HomeIcon,
    Lock as LockIcon,
    People as PeopleIcon,
    Person as PersonIcon,
    Store as StoreIcon,
    Inventory as InventoryIcon,
    Build as BuildIcon,
    ExpandLess,
    ExpandMore,
    Home,
    Store,
    Inventory,
    Dashboard,
    Engineering,
    Inventory2,
    AcUnit
} from "@mui/icons-material";


export default function SidebarMenu() {
    const [openCus, setOpenCus] = useState(false);
    const [openStock, setOpenStock] = useState(false);
    const [openEmp, setOpenEmp] = useState(false);
    const [openAcc, setOpenAcc] = useState(false);

    const [openMaterial, setOpenMaterial] = useState(false);
    const [openProduct, setOpenProduct] = useState(false);

    const Employee = [
        { text: "หน้าหลัก", href: "/dash-em", icon: <HomeIcon /> },
        { text: "จัดสิทธิ์การเข้าถึง", href: "/permission", icon: <LockIcon /> },
        { text: "ข้อมูลพนักงาน", href: "/employee", icon: <PeopleIcon /> }
    ];

    const Customer = [
        { text: "หน้าหลัก", href: "/dash-cus", icon: <HomeIcon /> },
        { text: "ข้อมูลลูกค้า", href: "/customer", icon: <PersonIcon /> }
    ];

    const Account = [
        { text: "หน้าหลัก", href: "/dash-acc", icon: <HomeIcon /> },
        { text: "ผู้จัดจำหน่าย", href: "/supplier", icon: <StoreIcon /> }
    ];

    const StockStore = [

        { text: "หน้าหลัก", href: "/dashboard-stock", icon: <HomeIcon /> },
        { text: "บันทึกสินค้าเข้า", href: "/stock-in", icon: <Inventory2 /> },
        { text: "เบิกสินค้าออก", href: "/stock-out", icon: <Engineering /> },
        { text: "จัดการหน่วยสินค้า", href: "/unit", icon: <AcUnit /> },
    ];

    const MenuList = [
        { text: "หนักหลัก", href: "/", icon: <Home /> },
    ];

    const Product = [
        { text: "แดชบอร์ด", href: "/dashboard-product", icon: <Dashboard /> },
        { text: "สินค้า", href: "/product", icon: <Inventory /> },
    ];

    const Material = [
        { text: "แดชบอร์ด", href: "/dashboard-material", icon: <Dashboard /> },
        { text: "วัสดุ", href: "/material", icon: <Store /> },
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
            {/* Manage Emp */}
            <ListItem disablePadding>
                <ListItemButton onClick={() => setOpenEmp(!openEmp)}>
                    <ListItemText primary="พนักงาน" />
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
                    <ListItemText primary="บัญชี" />
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

            {/* Manage Stock */}
            <ListItem disablePadding>
                <ListItemButton onClick={() => setOpenStock(!openStock)}>
                    <ListItemText primary="สต็อกสินค้า" />
                    <IconButton edge="end">
                        {openStock ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                </ListItemButton>
            </ListItem>
            <Collapse in={openStock} timeout="auto" unmountOnExit>
                {StockStore.map((item) => (
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
                {/* สินค้า */}
                <ListItem disablePadding>
                    <ListItemButton onClick={() => setOpenProduct(!openProduct)} >
                        <ListItemText primary="สินค้า" />
                        <IconButton edge="end">
                            {openProduct ? <ExpandLess /> : <ExpandMore />}
                        </IconButton>
                    </ListItemButton>
                </ListItem>
                <Collapse in={openProduct} timeout="auto" unmountOnExit>
                    {Product.map((item) => (
                        <ListItem key={item.text} disablePadding>
                            <Link href={item.href} passHref legacyBehavior>
                                <ListItemButton component="a" sx={{ pl: 4 }}>
                                    <ListItemIcon>{item.icon}</ListItemIcon>
                                    <ListItemText primary={item.text} />
                                </ListItemButton>
                            </Link>
                        </ListItem>
                    ))}
                </Collapse>
                <Divider />
                {/* วัสดุ */}
                <ListItem disablePadding>
                    <ListItemButton onClick={() => setOpenMaterial(!openMaterial)} >
                        <ListItemText primary="วัสดุ" />
                        <IconButton edge="end">
                            {openMaterial ? <ExpandLess /> : <ExpandMore />}
                        </IconButton>
                    </ListItemButton>
                </ListItem>
                <Collapse in={openMaterial} timeout="auto" unmountOnExit>
                    {Material.map((item) => (
                        <ListItem key={item.text} disablePadding>
                            <Link href={item.href} passHref legacyBehavior>
                                <ListItemButton component="a" sx={{ pl: 4 }}>
                                    <ListItemIcon>{item.icon}</ListItemIcon>
                                    <ListItemText primary={item.text} />
                                </ListItemButton>
                            </Link>
                        </ListItem>
                    ))}
                </Collapse>
                <Divider />
            </Collapse>


            {/* Manage Customer */}
            <ListItem disablePadding>
                <ListItemButton onClick={() => setOpenCus(!openCus)}>
                    <ListItemText primary="ข้อมูลลูกค้า" />
                    <IconButton edge="end">
                        {openCus ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                </ListItemButton>
            </ListItem>
            <Collapse in={openCus} timeout="auto" unmountOnExit>
                {Customer.map((item) => (
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
        </List >
    );
}
