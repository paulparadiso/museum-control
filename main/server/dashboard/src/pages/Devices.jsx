import React, { useState, useContext, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { DataGrid } from '@mui/x-data-grid';
import Slider from '../components/Slider';
import Modal from '@mui/material/Modal';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import { DeviceContext } from '../contexts/DeviceProvider';
import PandaPlayer from '../components/deviceTypes/PandaPlayer';

const Devices = () => {

    const [open, setOpen] = useState(false);
    const [state, dispatch] = useContext(DeviceContext);
    const [currentDevice, setCurrentDevice] = useState(null);
    const [rows, setRows] = useState([]);

    const getDeviceById = id => {
        let device = null;
        for (let i = 0; i < state.devices.length; i++) {
            if (state.devices[i]._id === id) {
                device = state.devices[i];
            }
        }
        console.log(device);
        return device;
    }

    const handleRowClick = (event, cellValues) => {
        setCurrentDevice(cellValues['id']);
        setOpen(true);
    }

    const saveDevice = data => {
        console.log(data);
        setOpen(false);
    }

    const handleClose = () => {
        setOpen(false);
    }

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
                            handleRowClick(e, cellValues);
                        }}
                    >
                        Edit
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
            field: 'tags',
            headerName: 'Tags',
            width: 200,
            editable: false
        },
        {
            field: 'type',
            headerName: 'Type',
            width: 100,
            editable: false
        },
        {
            field: 'location',
            headerName: 'Location',
            width: 100,
            editable: false
        },
        {
            field: 'zone',
            headerName: 'Zone',
            width: 100,
            editable: false
        },
        {
            field: 'ip',
            headerName: 'IP Address',
            width: 150,
            editable: false
        },
    ]

    useEffect(() => {
        setRows([...Object.values(state.devices)]);
    }, [state.devices]);

    return (
        <>
            <Box sx={{ p: 2 }}>
                <Typography component="h2" variant="h6" color="primary" sx={{
                    p: 2,
                }}>
                    Devices
                </Typography>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    getRowId={row => row._id}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 5,
                            }
                        }
                    }}
                    pageSizeOptions={[5]}
                    disableRowSelectionOnClick
                    sx={{ p: 2 }}
                />
            </Box>
            <Dialog
                open={open}
                onClose={handleClose}
            >
                <PandaPlayer
                    close={handleClose}
                    device={currentDevice}
                />
            </Dialog>
        </>
    )

}

export default Devices;