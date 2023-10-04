import React, { useState, useEffect, useContext, useRef } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { DataGrid } from '@mui/x-data-grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { ConfigContext } from '../contexts/ConfigProvider';
import Slider from '../components/Slider';
import Modal from '@mui/material/Modal';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80vh',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };

const Config = () => {

    const [state, dispatch] = useContext(ConfigContext);
    const [rows, setRows] = useState([]);
    const [sliderOpen, setSliderOpen] = useState(false);
    const [currentConfig, setCurrentConfig] = useState({});

    const configName = useRef();
    const mongoURI = useRef();
    const mongoUser = useRef();
    const mongoPass = useRef();
    const mqttBroker = useRef();
    const mqttPort = useRef();

    const handleRowClick = (event, cellValues) => {
        console.log(cellValues);
        setCurrentConfig(cellValues.row);
        setSliderOpen(true);
    }

    const handleClick = (event) => {
        console.log(`Saving ${configName.current.value}`);
        const newConfig = {
            name: configName.current.value,
            config: {
                'mongodb_uri': mongoURI.current.value,
                'mongodb_user': mongoUser.current.value,
                'mongodb_pass': mongoPass.current.value,
                'mqtt_broker': mqttBroker.current.value,
                'mqtt_port': mqttPort.current.value
            }
        }
        dispatch({ type: 'SAVE_CONFIG', payload: newConfig });
        setSliderOpen(false);
    }

    const handleNewClick = (event) => {
        setCurrentConfig({
            'name': '',
            'mongodb_uri': '',
            'mongodb_user': '',
            'mongodb_pass': '',
            'mqtt_broker': '',
            'mqtt_port': ''
        });
        setSliderOpen(true);
    }

    const columns = [
        {
            field: 'edit',
            headerName: '',
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
            field: 'name',
            headerName: 'Name',
            sortable: true,
            width: 150,
        },
        {
            field: 'mongodb_uri',
            headerName: 'MongoDB URI',
            sortable: true,
            width: 150
        },
        {
            field: 'mongodb_user',
            headerName: 'MongoDB User',
            sortable: false,
            width: 150
        },
        {
            field: 'mongodb_pass',
            headerName: 'MongoDB Password',
            sortable: false,
            width: 150,

        },
        {
            field: 'mqtt_broker',
            headerName: 'MQTT Broker',
            sortable: true,
            width: 150
        },
        {
            field: 'mqtt_port',
            headerName: 'MQTT Port',
            sortable: false,
            width: 10,
        },
    ]

    /*
    let rows = [
        {
            id: 0,
            name: 'two',
            mongodb_uri: 'mongodb://mongo:27017',
            mongodb_user: 'admin',
            mongodb_pass: 'admin',
            mqtt_broker: 'http://localhost',
            mqtt_port: 1880
        }
    ]
    */

    useEffect(() => {
        let tRows = [];
        console.log(state.configs);
        async function fillArray() {
            await Object.keys(state.configs).map((key, index) => {
                console.log(state.configs[key]);
                tRows.push({
                    ...state.configs[key],
                    id: index,
                    name: key
                })
            });
        }
        fillArray();
        console.log(tRows);
        setRows(tRows);
    }, [state.configs]);



    return (
        <>
            <Grid item xs={12} md={8} lg={12} sx={{
                p: 20
            }}>
                <Button variant="outlined" sx={{ m: 5 }}
                    onClick={handleNewClick}
                >
                    + New Config
                </Button>
                <DataGrid
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
                    sx={{ p: 2 }}
                />
            </Grid>
            <Modal
                open={sliderOpen}
            >
                <Box sx={{...style}} >
                    <Grid container spacing={1}>
                        <Grid item xs={12} sx={{textAlign: 'center'}}>
                        <Typography component="h2" variant="h6" color="primary" sx={{
                        p: 2,
                    }}>
                        <TextField
                            id="name"
                            label="Name"
                            variant="outlined"
                            defaultValue={currentConfig.name || ''}
                            inputRef={configName}
                        />


                    </Typography>
                    </Grid>
                        <Grid item xs={6}>
                            <TextField
                                id="mongo-uri"
                                label="MongoDB URI"
                                variant="outlined"
                                defaultValue={currentConfig.mongodb_uri || ''}
                                inputRef={mongoURI}
                            />
                            <TextField
                                id="mongo-user"
                                label="MongoDB User"
                                variant="outlined"
                                defaultValue={currentConfig.mongodb_user || ''}
                                inputRef={mongoUser}
                            />
                            <TextField
                                id="mongo-pass"
                                label="MongoDB Password"
                                variant="outlined"
                                defaultValue={currentConfig.mongodb_pass || ''}
                                inputRef={mongoPass}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                id="mqtt-broker"
                                label="MQTT Broker"
                                variant="outlined"
                                defaultValue={currentConfig.mqtt_broker || ''}
                                inputRef={mqttBroker}
                            />
                            <TextField
                                id="mongo-port"
                                label="MQTT Port"
                                variant="outlined"
                                defaultValue={currentConfig.mqtt_port || ''}
                                inputRef={mqttPort}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button onClick={handleClick} variant="outlined">Save</Button>
                        </Grid>
                    </Grid>
                </Box>
            </Modal>
        </>
    )

}

export default Config;