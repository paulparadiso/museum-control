import React, { useState, useContext, useEffect } from 'react';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import { MediaContext } from '../contexts/MediaProvider';
import LinearProgress from '@mui/material/LinearProgress';

const Notifications = props => {

    const [open, setOpen] = useState(false);
    const [mediaState, mediaDispatch] = useContext(MediaContext);

    const handleClick = () => {
        setOpen(true);
    }

    const handleClose = (e, reason) => {
        setOpen(false);
    }

    useEffect(() => {
        if(Object.keys(mediaState.notifications).length !== 0) {
            setOpen(true);
        } else {
            setOpen(false);
        }
    }, [mediaState.notifications]);

    const action = (
        <>
            {
                Object.keys(mediaState.notifications).map(key => {
                    return (
                        <Box
                            key={`progress-${key}`} 
                            sx={{width: '100%'}}>
                        {key }
                        <LinearProgress
                            variant="determinate"
                            value={mediaState.notifications[key].progress}
                        />
                        </Box>
                    )
                })
            }
        </>
    )

    return (
        <div>
        <Snackbar
            open={open}
            onClose={handleClose}
            action={action}
        />
        </div>
    );
}

export default Notifications;