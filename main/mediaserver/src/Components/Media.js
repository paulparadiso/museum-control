import React, { useContext, useState, useRef } from 'react';
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
import LinearProgress from '@mui/material/LinearProgress';

let clickCount = 0;

const UploadMedia = props => {

    const [apiData, apiDispatch] = useContext(APIContext);

    const { onClose, selectedValue, open } = props;
    const [playlist1, setPlaylist1] = useState('');
    const [playlist2, setPlaylist2] = useState('');
    const [name, setName] = useState('');

    const [progress, setProgress] = React.useState(0);

    const fileInput = useRef();

    let percentComplete = 100;

    const handleClose = () => {
        onClose(selectedValue);
    }

    const handleChange1 = e => {
        console.log(e.target.value);
        setPlaylist1(e.target.value);
    }

    const handleChange2 = e => {
        console.log(e.target.value);
        setPlaylist2(e.target.value);
    }

    const handleNameChange = e => {
        setName(e.target.value);
    }

    const handleUploadProgress = p => {
        //console.log(p.loaded);
        setProgress(Math.round( (p.loaded * 100) / p.total ));
    }

    const downloadComplete = () => {
        handleClose();
    }

    const handleSave = () => {
        //console.log('save');
        setProgress(0);
        apiDispatch({
            type: 'UPLOAD',
            payload: {
                file: fileInput.current.files[0],
                handleUploadProgress: handleUploadProgress,
                downloadComplete: downloadComplete
            }
        });
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
                <DialogTitle>Upload Media</DialogTitle>
                <div>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => fileInput.current.click()}
                    >
                        select file
                    </Button>

                    <input
                        ref={fileInput}
                        type="file"
                        style={{ display: 'none' }}
                    />

                    {fileInput.current ? fileInput.current.files[0] ? fileInput.current.files[0].name : '' : ''}

                </div>

                <Button onClick={handleSave}>upload</Button>
                <LinearProgress variant="determinate" value={progress} />
            </Box>
        </Dialog>
    )
}

const Media = props => {

    const [apiData, apiDispatch] = useContext(APIContext);

    const [collapseState, setCollapseState] = useState({});

    const [open, setOpen] = React.useState(false);
    const [name, setName] = React.useState('');

    const handleClickOpen = () => {
        setOpen(true);
    }

    const handleClose = (value) => {
        setOpen(false);
        setName(value);
    }

    const handleClick = i => {
        const currentValue = collapseState[i] || false;
        const nextState = { ...collapseState }
        nextState[i] = !currentValue;
        setCollapseState(nextState);
        //console.log(collapseState);
        //updateTags(i, ['one', 'two']);
        //console.log(clickCount++);
    }

    const updateTags = (id, tags) => {
        console.log('UPDATE_TAGS');
        apiDispatch({
            type: 'UPDATE',
            payload: {
                id: id,
                data: tags,
                property: 'tags'
            }
        });
    }

    return (
        <React.Fragment>
            <Button variant="outlined" onClick={handleClickOpen}>
                Upload Media
            </Button>
            <List>
                {
                    apiData.media ?
                        apiData.media.map((m, i) => {
                            return (
                                <React.Fragment key={`media-${i}`}>
                                    <ListItemButton onClick={() => handleClick(m._id)}>
                                        <ListItemText primary={m.name}></ListItemText>
                                    </ListItemButton>
                                    <Collapse key={`media-${i}`} in={collapseState[m._id]} timeout="auto" unmountOnExit>
                                        <List component="div" disablePadding>
                                            <ListItem sx={{ pl: 4 }}>
                                                <ListItemText primary={m.path} />
                                            </ListItem>
                                            <ListItem sx={{ pl: 4 }}>
                                                <ListItemText primary={m.tags} />
                                            </ListItem>
                                        </List>
                                    </Collapse>
                                </React.Fragment>
                            )
                        })
                        :
                        <div>FAIL</div>
                }
            </List>
            <UploadMedia
                name={name}
                open={open}
                onClose={handleClose}
            />
        </React.Fragment>
    )

}

export default Media;