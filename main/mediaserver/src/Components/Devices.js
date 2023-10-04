import React, { useContext, useState, useEffect } from 'react';
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

const Devices = props => {

    const [apiData, apiDispatch] = useContext(APIContext);

    const [contents, setContents] = useState({});

    const handleChange = (deviceId, e) => {
        let contentName = e.target.value;
        let nextContents = {...contents};
        nextContents[deviceId] = contentName;
        console.log(`setting contents of ${deviceId} to ${contentName}`)
        setContents({...nextContents});
    }

    const handleUpdate = deviceId => {
        let content = getContentByName(contents[deviceId]);
        apiDispatch({
            type: 'UPDATE',
            payload: {
                model: 'device',
                data: {
                    id: deviceId,
                    content: content._id
                }
            }
        })
    }

    const getContentByName = name => {
        let content;
        apiData.contents.forEach(c => {
            if (c.name == name) {
                content = c;
            }
        })
        return content;
    }

    const getContentNameById = id => {
        let content;
        apiData.contents.forEach(c => {
            if (c._id == id) {
                content = c;
            }
        })
        if(content) {
            return content.name;
        } else {
            return null;
        }
    }

    useEffect(() => {
        let contentsObj = {}
        apiData.devices.map(d => {
            console.log(d._id);
            contentsObj[d._id] = getContentNameById(d.content) || ''
        });
        setContents({ ...contentsObj });
    }, []);

    return (
        <List>
            {
                apiData.devices ?
                    apiData.devices.map(d => {
                        return (
                            <ListItem key={d._id}>
                                {d.hostname}&nbsp;{d.IP}&nbsp;({d.MAC})
                                <Select
                                    key={`select-${d._id}`}
                                    value={contents[d._id] || ''}
                                    onChange={(e) => handleChange(d._id, e)}
                                    style={{ width: '20% ' }}
                                >
                                    {
                                        apiData.contents.map(c => {
                                            return (
                                                <MenuItem
                                                    key={`menu-item-${d._id}-${c._id}`}
                                                    value={c.name}
                                                >
                                                    {c.name}
                                                </MenuItem>
                                            )
                                        })
                                    }
                                </Select>
                                <Button 
                                    variant="outlined" 
                                    key={`button-${d._id}`}
                                    onClick={() => handleUpdate(d._id)}
                                >
                                    Update
                                </Button>
                            </ListItem>
                        )
                    })
                    :
                    <div></div>
            }
        </List>
    )

}

export default Devices