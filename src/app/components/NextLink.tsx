import React, { useState } from 'react';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Collapse } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';
import MailIcon from '@mui/icons-material/Mail';

const NextLink = () => {
    const [open, setOpen] = useState(false);

    const handleClick = () => {
        setOpen(!open);  // เปลี่ยนสถานะของ open เพื่อแสดง/ซ่อนรายการ
    };

    return (
        <List>
            {/* ปุ่ม Manage */}
            <ListItem onClick={handleClick}>
                <ListItemText primary="Manage" />
            </ListItem>

            {/* รายการที่แสดงเมื่อเปิด */}
            <Collapse in={open} timeout="auto" unmountOnExit>
                {['All mail', 'Trash', 'Spam'].map((text, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </Collapse>
        </List>
    );
};

export default NextLink;
