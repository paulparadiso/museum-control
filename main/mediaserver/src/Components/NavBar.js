import React, { useContext } from 'react';
import { NavContext } from '../Contexts/NavProvider';
import { APIContext } from '../Contexts/APIProvider';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';

const NavBar = props => {

    const pages = ['Media', 'Playlists', 'Content', 'Devices', 'Sync'];
    const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

    const {page, setPage} = useContext(NavContext);

    const [apiData, apiDispatch] = useContext(APIContext);

    const [anchorElNav, setAnchorElNav] = React.useState();
    const [anchorElUser, setAnchorElUser] = React.useState();

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => { 
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = e => {
        const page = e.target.innerText;
        setPage(page.toLowerCase());
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handlePageSelection = page => {
        console.log(page);
        setPage(page.lowercase());
    }

    const handleSync = () => {
        console.log('sync');
        apiDispatch({
            type: 'SYNC', 
            payload: {}
        })
    }

    return (
        <AppBar position="static">
            <Container maxWidth="x1">
                <Toolbar disableGutters>
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            {pages.map((page) => (
                                <MenuItem key={page} onClick={handleCloseNavMenu}>
                                    <Typography textAlign="center">{page}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pages.map((page) => (
                            <Button
                                key={page}
                                onClick={handleCloseNavMenu}
                                sx={{ my: 2, color: 'white', display: 'block' }}
                            >
                                {page}
                            </Button>
                        ))}
                        <Button 
                            variant="outlined"
                            color="success"
                            onClick={handleSync}
                            >sync players</Button>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );

}

export default NavBar;
