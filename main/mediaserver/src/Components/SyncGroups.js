import React, { useContext, useState } from 'react';
import { APIContext } from '../Contexts/APIProvider';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';
import { blue } from '@mui/material/colors';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Box from '@mui/material/Box';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

const CreateSyncGroup = props => {

    const [apiData, apiDispatch] = useContext(APIContext);

    //console.log(apiData);

    const {onClose, selectedValue, open } = props;
    const [device, setDevice] = useState('');
    const [deviceList, setDeviceList] = useState([]);
    const [name, setName] = useState('');

    const handleClose = () => {
        onClose(selectedValue);
    }

    const handleChange = e => {
        console.log(e.target.value);
        setDevice(e.target.value);
    }

    const handleAddClick = () => {
        console.log(`Add ${device} to syncGroup.`);
        setDeviceList([...deviceList, device]);
    }

    const handleNameChange = e => {
        setName(e.target.value);
    }

    const handleSave = () => {
        //console.log('save');
        let idList = [];
        deviceList.forEach(i => {
            idList.push(apiData.devices[i]._id);
        })
        apiDispatch({
            type: 'CREATE', 
            payload: {
                model: 'syncGroup',
                data: {
                    name: name,
                    devices: idList
                }
            }
        })
        setDeviceList([]);
        handleClose();  
    }

    const handleClear = () => {
        setDeviceList([]);
    }

    return (
        <Dialog 
            onClose={handleClose} 
            open={open}
            fullWidth
            maxWidth="md"
        >
            <Box 
                sx={{
                    m: 2
                }}
            >
            <DialogTitle>Create Sync Group</DialogTitle>
            <TextField id="sync-group-name" onChange={handleNameChange}/>
            <InputLabel id="sync-group-select-label">Device</InputLabel>
            <Select 
                labelId="sync-group-device-select-label"
                id="sync-group-device-select"
                value={device}
                label="Device"
                onChange={handleChange}
                style={{width: '50% '}}
            >
            {
                apiData.devices ?
                apiData.devices.map((d, i) => {
                    return <MenuItem key={d._id} value={i}>{d.hostname}</MenuItem>
                })
                :
                <div>Nothing</div>
            }
            </Select>
            <AddCircleOutlineIcon
                onClick={handleAddClick}
                margin="auto"
            />
            <List>
            {
                deviceList.map(i => {
                    return (
                        <ListItem key={i}>
                            <ListItemText>{apiData.devices[i].hostname}</ListItemText>
                        </ListItem>
                    );
                })
            }
            </List>
            <Button onClick={handleSave}>Save</Button>
            <Button onClick={handleClear}>clear</Button>
            </Box>
        </Dialog>   
    )
}

const SyncGroups = props => {


    const [ apiData, apiDispatch ] = useContext(APIContext);

    const [open, setOpen] = React.useState(false);
    const [name, setName] = React.useState('');

    const [collapseState, setCollapseState] = useState({});

    const handleClickOpen = () => {
        setOpen(true);
    }

    const handleClose = (value) => {
        setOpen(false);
        setName(value);
    }

    const handleDelete = (id) => {
        apiDispatch({
            type: 'REMOVE',
            payload: {
                model: 'syncGroup',
                data: {
                    id: id
                }
            }
        })
    }

    const handleClick = i => {
        console.log(i);
        const currentValue = collapseState[i] || false;
        const nextState = {...collapseState}
        nextState[i] = !currentValue;
        setCollapseState(nextState);
    }

    const getDevice = id => {
        let device = null;
        apiData.devices.forEach(d => {
            if(d._id == id) {
                device = d;
            }
        });
        return device;
    }

    const handleSync = (e, id) => {
        e.preventDefault();
        console.log(`calling sync on ${id}`);
    }

    return(
        <React.Fragment>
            <Button variant="outlined" onClick={handleClickOpen}>
                Create Sync Group
            </Button>
            <List>
            {   
                apiData.syncGroups ?
                apiData.syncGroups.map(sg => {
                    return (
                        <React.Fragment>
                        <ListItemButton key={`lib-${sg._id}`} onClick={()=> {handleClick(sg._id)}}>
                        <ListItem key={`li-${sg._id}`}>{sg.name} 
                            <Button variant="outlined" onClick={(e) => handleSync(e, sg._id)} style={{zIndex: 10}}>sync</Button>
                            <IconButton key={`ic-${sg._id}`} onClick={() => handleDelete(sg._id)}>
                                <DeleteForeverIcon key={`df-${sg._id}`} />
                            </IconButton>
                        </ListItem>
                        </ListItemButton>
                        <Collapse key={`items-${sg._id}`} in={collapseState[sg._id]} timeout="auto" unmountOnExit>
                            <List key={`l-${sg._id}`}>
                                {
                                sg.devices.map(i => {
                                    return (
                                        <ListItem key={`mli-${i}`}      >
                                            {getDevice(i).hostname}
                                        </ListItem>
                                    )
                                })
                                }
                            </List>
                        </Collapse>
                        </React.Fragment>
                    )
                })
                :
                <div></div>
            }
            </List>
            <CreateSyncGroup
                name={name}
                open={open}
                onClose={handleClose}
            />

        </React.Fragment>
    )

}

export default SyncGroups;