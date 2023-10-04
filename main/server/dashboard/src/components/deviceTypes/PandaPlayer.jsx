import react, { useState, useContext, useEffect } from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import { MediaContext } from '../../contexts/MediaProvider';
import { DeviceContext } from '../../contexts/DeviceProvider';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const PandaPlayer = props => {

    const [zone, setZone] = useState(props.zone);
    const [location, setLocation] = useState(props.zone);
    const [content1, setContent1] = useState(props.content1);
    const [content2, setContent2] = useState(props.content2);
    const [tags, setTags] = useState(props.tags);

    const [mediaState, mediaDispatch] = useContext(MediaContext);
    const [deviceState, deviceDispatch] = useContext(DeviceContext);

    const handleSaveDevice = () => {
        deviceDispatch({
            type: 'UPDATE_DEVICE',
            payload: {
                ...deviceState.devices[props.device],
                zone: zone,
                location: location,
                details: {
                    ...deviceState.devices[props.device].details,
                    content1: content1,
                    content2: content2
                }
            }
        });
        props.close();
    }

    const handleCancel = () => {
        props.close();
    }

    const handleMediaChange = (slot, value) => {
        if (slot === 0) {
            setContent1(value);
        } else {
            setContent2(value);
        }
    }

    useEffect(() => {
        console.log(props.device);
        const device = deviceState.devices[props.device];
        console.log(device);
        setZone(device.zone);
        setLocation(device.location);
        setContent1(device.details.content1);
        setContent2(device.details.content2);
    }, []);

    return (
        <>
            <DialogTitle>Edit Panda Player</DialogTitle>
            <DialogContent>
                <TextField
                    margin="dense"
                    id="zone"
                    label="Zone"
                    fullWidth
                    value={zone}
                    onChange={e => setZone(e.target.value)}
                    variant="standard"
                />
                <TextField
                    margin="dense"
                    id="location"
                    label="Location"
                    fullWidth
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    variant="standard"
                />
                <Select
                    value={content1 ? content1 : ''}
                    onChange={e => { handleMediaChange(0, e.target.value) }}
                    sx={{ width: 300 }}
                    label='Content 1'
                >
                    {
                        Object.keys(mediaState.media).map((id) => {
                            return <MenuItem key={`menu-item-${id}`} value={id}>{mediaState.media[id].name}</MenuItem>
                        })
                    }
                </Select>
                <Select
                    value={content2 ? content2 : ''}
                    onChange={e => { handleMediaChange(1, e.target.value) }}
                    sx={{ width: 300 }}
                    label='Content 2'
                >
                    {
                        Object.keys(mediaState.media).map((id) => {
                            return <MenuItem key={`menu-item-${id}`} value={id}>{mediaState.media[id].name}</MenuItem>
                        })
                    }
                    <MenuItem value="None">None</MenuItem>
                </Select>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancel}>Cancel</Button>
                <Button onClick={handleSaveDevice}>Save</Button>
            </DialogActions>
        </>
    )

}

export default PandaPlayer;