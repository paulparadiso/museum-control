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

const CreatePlaylist = props => {

    const [apiData, apiDispatch] = useContext(APIContext);

    //console.log(apiData);

    const {onClose, selectedValue, open } = props;
    const [media, setMedia] = useState('');
    const [mediaList, setMediaList] = useState([]);
    const [name, setName] = useState('');

    const handleClose = () => {
        onClose(selectedValue);
    }

    const handleChange = e => {
        console.log(e.target.value);
        setMedia(e.target.value);
    }

    const handleAddClick = () => {
        console.log(`Add ${media} to playlist.`);
        setMediaList([...mediaList, media]);
    }

    const handleNameChange = e => {
        setName(e.target.value);
    }

    const handleSave = () => {
        //console.log('save');
        let idList = [];
        mediaList.forEach(i => {
            idList.push(apiData.media[i]._id);
        })
        apiDispatch({
            type: 'CREATE', 
            payload: {
                model: 'playlist',
                data: {
                    name: name,
                    items: idList
                }
            }
        })
        setMediaList([]);
        handleClose();  
    }

    const handleClear = () => {
        setMediaList([]);
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
            <DialogTitle>Create Playlist</DialogTitle>
            <TextField id="playlist-name" onChange={handleNameChange}/>
            <InputLabel id="playlist-media-select-label">Media</InputLabel>
            <Select 
                labelId="playlist-media-select-label"
                id="playlist-media-select"
                value={media}
                label="Media"
                onChange={handleChange}
                style={{width: '50% '}}
            >
            {
                apiData.media ?
                apiData.media.map((m, i) => {
                    return <MenuItem key={m._id} value={i}>{m.name}</MenuItem>
                })
                :
                <div></div>
            }
            </Select>
            <AddCircleOutlineIcon
                onClick={handleAddClick}
                margin="auto"
            />
            <List>
            {
                mediaList.map(i => {
                    return (
                        <ListItem key={i}>
                            <ListItemText>{apiData.media[i].name}</ListItemText>
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

const Playlists = props => {


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
                model: 'playlist',
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

    const getMediaItem = id => {
        let mediaItem = null;
        apiData.media.forEach(m => {
            if(m._id == id) {
                mediaItem = m;
            }
        });
        return mediaItem;
    }

    return(
        <React.Fragment>
            <Button variant="outlined" onClick={handleClickOpen}>
                Create Playlist
            </Button>
            <List>
            {   
                apiData.playlists ?
                apiData.playlists.map(p => {
                    return (
                        <React.Fragment>
                        <ListItemButton key={`lib-${p._id}`} onClick={()=> {handleClick(p._id)}}>
                        <ListItem key={`li-${p._id}`}>{p.name} 
                            <IconButton key={`ic-${p._id}`} onClick={() => handleDelete(p._id)}>
                                <DeleteForeverIcon key={`df-${p._id}`} />
                            </IconButton>
                        </ListItem>
                        </ListItemButton>
                        <Collapse key={`items-${p._id}`} in={collapseState[p._id]} timeout="auto" unmountOnExit>
                            <List key={`l-${p._id}`}>
                                {
                                p.items.map(i => {
                                    return (
                                        <ListItem key={`mli-${i}`}      >
                                            {getMediaItem(i).name}
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
            <CreatePlaylist
                name={name}
                open={open}
                onClose={handleClose}
            />

        </React.Fragment>
    )

}

export default Playlists;