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

const CreateContent = props => {

    const [apiData, apiDispatch] = useContext(APIContext);

    const { onClose, selectedValue, open } = props;
    const [playlist1, setPlaylist1] = useState('');
    const [playlist2, setPlaylist2] = useState('');
    const [name, setName] = useState('');

    const handleClose = () => {
        onClose(selectedValue);
    }

    const handleChange1 = e => {
        setPlaylist1(e.target.value);
    }

    const handleChange2 = e => {
        setPlaylist2(e.target.value);
    }

    const handleNameChange = e => {
        setName(e.target.value);
    }

    const handleSave = () => {
        //console.log('save');
        apiDispatch({
            type: 'CREATE',
            payload: {
                model: 'content',
                data: {
                    name: name,
                    playlists: [apiData.playlists[playlist1]._id, apiData.playlists[playlist2]._id]
                }
            }
        })
        handleClose();
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
                <DialogTitle>Create Content</DialogTitle>
                <TextField id="content-name" onChange={handleNameChange} />
                <InputLabel id="content--select-label">Screen 1</InputLabel>
                <Select
                    labelId="playlist1-select-label"
                    id="playlist1-select"
                    value={playlist1}
                    label="Playlist 1"
                    onChange={handleChange1}
                    style={{ width: '50% ' }}
                >
                    {
                        apiData.playlists ?
                            apiData.playlists.map((p, i) => {
                                return <MenuItem key={p._id} value={i}>{p.name}</MenuItem>
                            })
                            :
                            <div></div>
                    }
                </Select>
                <InputLabel id="content--select-label">Screen 1</InputLabel>
                <Select
                    labelId="playlist2-select-label"
                    id="playlist2-select"
                    value={playlist2}
                    label="Playlist 2"
                    onChange={handleChange2}
                    style={{ width: '50% ' }}
                >
                    {
                        apiData.playlists ?
                            apiData.playlists.map((p, i) => {
                                return <MenuItem key={p._id} value={i}>{p.name}</MenuItem>
                            })
                            :
                            <div></div>
                    }
                </Select>

                <Button onClick={handleSave}>Save</Button>
            </Box>
        </Dialog>
    )
}

const Content = props => {

    const [apiData, apiDispatch] = useContext(APIContext);

    const [open, setOpen] = React.useState(false);
    const [name, setName] = React.useState('');

    const [playlists, setPlaylists] = useState([]);

    const handleClickOpen = () => {
        setOpen(true);
    }

    const handleClose = (value) => {
        setOpen(false);
        setName(value);
    }

    const handleDelete = (id) => {
        console.log(`Deleting ${id}`);
        apiDispatch({
            type: 'REMOVE',
            payload: {
                model: 'content',
                data: {
                    id: id
                }
            }
        })
    }

    const handleChange = (s, p, e) => {
        let nextPlaylists = [...playlists];
        nextPlaylists[s].screens[p] = e.target.value;
        setPlaylists([...nextPlaylists]);
    }

    const handleUpdate = (id, playlistSet) => {
        let playlist1 = getPlaylistIdFromName(playlists[playlistSet].screens[0]);
        let playlist2 = getPlaylistIdFromName(playlists[playlistSet].screens[1]);
        console.log(`Setting content:${id} to [${playlist1}, ${playlist2}]`);
        apiDispatch({
            type: 'UPDATE',
            payload: {
                model: 'content',
                data: {
                    id: id,
                    playlists: [playlist1, playlist2]
                }
            }
        })
    }

    const getPlaylistNameFromId = id => {
        let name = '';
        apiData.playlists.map(p => {
            if (p._id == id) {
                name = p.name;
            }
        });
        return name;
    }

    const getPlaylistIdFromName = name => {
        let id = '';
        apiData.playlists.map(p => {
            if (p.name == name) {
                id = p._id;
            }
        });
        return id;
    }

    useEffect(() => {
        let playlistArr = [];
        apiData.contents.map(c => {
            playlistArr.push({
                screens: [getPlaylistNameFromId(c.playlists[0]), getPlaylistNameFromId(c.playlists[1])]
            });
        });
        setPlaylists(playlistArr);
    }, []);

    return (
        <React.Fragment>
            <Button variant="outlined" onClick={handleClickOpen}>
                Create Content
            </Button>
            <CreateContent
                name={name}
                open={open}
                onClose={handleClose}
            />
            <List>
                {
                    apiData.contents ?
                        apiData.contents.map((c, i) => {
                            return (
                                <ListItem key={c._id}>
                                    {c.name} &nbsp; {c.content}
                                    Screen 1:
                                    {
                                        playlists.length > i ?
                                            <Select
                                                key={`select1-${c._id}`}
                                                value={playlists[i].screens[0] || ''}
                                                onChange={(e) => handleChange(i, 0, e)}
                                                style={{ width: '20% ' }}
                                            >
                                                {
                                                    apiData.playlists.map(p => {
                                                        return (
                                                            <MenuItem key={`menu-item-1-${p._id}`}
                                                                value={p.name}
                                                            >
                                                                {p.name}
                                                            </MenuItem>
                                                        );
                                                    })
                                                }
                                            </Select>
                                            :
                                            <div></div>
                                    }
                                    Screen 2:
                                    {
                                        playlists.length > i ?
                                            <Select
                                                key={`select2-${c._id}`}
                                                value={playlists[i].screens[1]}
                                                onChange={(e) => handleChange(i, 1, e)}
                                                style={{ width: '20% ' }}
                                            >
                                                {
                                                    apiData.playlists.map(p => {
                                                        return (
                                                            <MenuItem key={`menu-item-2-${p._id}`}
                                                                value={p.name}
                                                            >
                                                                {p.name}
                                                            </MenuItem>
                                                        );
                                                    })
                                                }
                                            </Select>
                                            :
                                            <div></div>
                                    }
                                    <Button
                                        variant="outlined"
                                        onClick={() => handleUpdate(c._id, i)}
                                    >update</Button>
                                    <IconButton key={`delete-${c._id}`} onClick={() => handleDelete(c._id)}>
                                        <DeleteForeverIcon key={`delete-icon-${c._id}`} />
                                    </IconButton>
                                </ListItem>
                            )
                        })
                        :
                        <div></div>
                }
            </List>
        </React.Fragment>
    )

}

export default Content;
