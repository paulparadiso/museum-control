import React, { useEffect, useState, useContext } from 'react';
import { SyncGroupContext } from '../contexts/SyncGroupProvider';
import { DeviceContext } from '../contexts/DeviceProvider';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

const SyncGroups = () => {

    const [state, dispatch] = useContext(SyncGroupContext);
    const [deviceState, deviceDispatch] = useContext(DeviceContext);
    const [rows, setRows] = useState([]);
    const [createSyncGroupOpen, setCreateSyncGroupOpen] = useState(false)
    const [editSyncGroupOpen, setEditSyncGroupOpen] = useState(false);
    const [name, setName] = useState('');
    const [devices, setDevices] = useState([]);
    const [deviceToAdd, setDeviceToAdd] = useState(null);

    const handleCreateSyncGroupClick = () => {
        setCreateSyncGroupOpen(true);
    }

    const handleEditSyncGroupClick = (e, cellValues) => {
        setEditSyncGroupOpen(true);
    }

    const handleCreateSyncGroup = () => {
        console.log(`Create ${name} with ${devices}`);
        dispatch({
            type: 'CREATE_SYNC_GROUP',
            payload: {
                name: name,
                devices: devices
            }
        })
        setCreateSyncGroupOpen(false);
    }

    const handleEditSyncGroup = () => {
        setEditSyncGroupOpen(false);
    }

    const handleDeviceChange = e => {

    }

    const addDeviceToSyncGroup = () => {
        if(devices.includes(deviceToAdd)) {
            return;
        }
        setDevices(devices => [...devices, deviceToAdd]);
    }

    useEffect(() => {
        setRows(Object.values(state.syncGroups));
    }, [state.syncGroups]);

    useEffect(() => {
        console.log(rows);
    }, [rows]);

    const columns = [
        {
            field: 'edit',
            headerName: '',
            sortable: false,
            renderCell: (cellValues) => {
                return (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={e => {
                            handleEditSyncGroupClick(e, cellValues);
                        }}
                    >
                        Edit
                    </Button>
                )
            }
        },
        {
            field: 'trigger',
            headerName: '',
            sortable: false,
            renderCell: (cellValues) => {
                return (
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={e => {
                            handleTriggerSyncGroupClick(e, cellValues);
                        }}
                    >
                        Trigger
                    </Button>
                )
            }
        },
        {
            field: 'id',
            headerName: 'ID',
            width: 10,
            editable: false,
        },
        {
            field: 'name',
            headerName: 'Name',
            width: 100,
            editable: false
        },
        {
            field: 'devices',
            headerName: 'Devices',
            width: 600,
            editable: false
        },
    ]

    return (
        <>
            <Grid container>
                <Grid item xs={11}>
                    <Button
                        variant="outlined"
                        onClick={handleCreateSyncGroupClick}
                        sx={{ m: 2 }}
                    >+ Create Sync Group</Button>
                </Grid>
                <Grid item xs={11}>
                    <DataGrid
                        getRowId={row => row._id}
                        rows={rows}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    pageSize: 5,
                                }
                            }
                        }}
                        pageSizeOptions={[5]}
                        disableRowSelectionOnClick
                        sx={{ m: 2 }}
                    />
                </Grid>
            </Grid>
            <Dialog
                open={createSyncGroupOpen}
            >
                <DialogTitle>Create Sync Group</DialogTitle>
                <TextField
                    margin="normal"
                    id="name"
                    label="Name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    variant="standard"
                />
                <Select
                    value={deviceToAdd ? deviceToAdd : ''}
                    onChange={e => { setDeviceToAdd(e.target.value) }}
                    sx={{ width: 300 }}
                    label='Device'
                >
                    {
                        Object.values(deviceState.devices).map((device) => {
                            return <MenuItem key={`menu-item-${device._id}`} value={device.name}>{device.name}</MenuItem>
                        })
                    }
                </Select>
                <Button
                    variant="outlined"
                    onClick={addDeviceToSyncGroup}
                >
                    + Add
                </Button>
                <List>
                    {
                        devices.map(d => {
                            return <ListItem key={`list-item-${d}`}><ListItemText key={`list-item-text-${d}`}>{d}</ListItemText></ListItem>
                        })
                    }
                </List>
                <DialogContent>
                    <DialogActions>
                        <Button variant="outlined" onClick={() => setCreateSyncGroupOpen(false)}>Cancel</Button>
                        <Button variant="outlined" onClick={handleCreateSyncGroup}>Save</Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>
            <Dialog
                open={editSyncGroupOpen}
            >
                <DialogTitle>
                    Edit Sync Group
                </DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        id="edit-name"
                        label="name"
                        fullWidth
                        value={name}
                        onChange={e => setName(e.target.value)}
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={() => setEditSyncGroupOpen(false)}>Cancel</Button>
                    <Button variant="outlined" onClick={handleEditSyncGroup}>Save</Button>
                </DialogActions>
            </Dialog>
        </>
    )

}

export default SyncGroups;