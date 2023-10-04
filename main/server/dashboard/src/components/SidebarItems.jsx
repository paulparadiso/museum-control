import React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PermMediaIcon from '@mui/icons-material/PermMedia';
import MicrowaveIcon from '@mui/icons-material/Microwave';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import CountertopsIcon from '@mui/icons-material/Countertops';
import VideocamIcon from '@mui/icons-material/Videocam';
import { Link } from 'react-router-dom';

const SidebarItems = props => {
    
    return (
    <>
        <ListItemButton
            component={Link}
            to="/"
        >
            <ListItemIcon>
                <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
        </ListItemButton>
        <ListItemButton
            component={Link}
            to="/media"
        >
            <ListItemIcon>
                <PermMediaIcon />
            </ListItemIcon>
            <ListItemText primary="Media" />
        </ListItemButton>
        <ListItemButton
            component={Link}
            to="/devices"
        >
            <ListItemIcon>
                <MicrowaveIcon />
            </ListItemIcon>
            <ListItemText primary="Devices" />
        </ListItemButton>
        <ListItemButton
            component={Link}
            to="/status"
        >
            <ListItemIcon>
                <MonitorHeartIcon />
            </ListItemIcon>
            <ListItemText primary="Status" />
        </ListItemButton>
        <ListItemButton
            component={Link}
            to="/syncgroups"
        >
            <ListItemIcon>
                <CountertopsIcon />
            </ListItemIcon>
            <ListItemText primary="Sync Groups" />
        </ListItemButton>
        <ListItemButton
            component={Link}
            to="/video"
        >
            <ListItemIcon>
                <VideocamIcon />
            </ListItemIcon>
            <ListItemText primary="Live Video" />
        </ListItemButton>
        <ListItemButton
            component={Link}
            to="/config"
        >
            <ListItemIcon>
                <SettingsRoundedIcon />
            </ListItemIcon>
            <ListItemText primary="Config" />
        </ListItemButton>
    </>
    )
}

export default SidebarItems;
