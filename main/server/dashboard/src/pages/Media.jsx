import React, { useState, useEffect, useContext } from 'react';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Input from '@mui/material/Input';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { MediaContext } from '../contexts/MediaProvider';
import MediaTags from '../components/MediaTags';
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete'; 

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

const MediaServer = () => {

    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [file, setFile] = useState();
    const [tags, setTags] = useState([]);
    const [rows, setRows] = useState([]);
    const [notes, setNotes] = useState('');

    const [state, dispatch] = useContext(MediaContext);

    const [currentMedia, setCurrentMedia] = useState(null);

    const handleAddMediaClick = e => {
        setOpen(true);
    }

    const handleEditMediaClick = (e, cellValues) => {
        setCurrentMedia(cellValues['id']);
        setEditOpen(true);
    }

    const handleEditMediaCancel = () => {
        setEditOpen(false);
    }

    const handleSaveMedia = () => {
        setEditOpen(false);
    }

    const handleFileChange = e => {
        console.log(`Setting file to ${e.target.files[0]}`);
        setFile(e.target.files[0]);
    }

    const handleUploadMedia = e => {
        dispatch({
            type: 'UPLOAD_MEDIA',
            payload: {
                file: file,
                tags: tags
            }
        });
        setOpen(false);
    }

    const handleDeleteMedia = () => {
        setDeleteOpen(true);
        setEditOpen(false);
    }

    const handleDeleteMediaConfirm = () => {
        dispatch({
            type: 'DELETE_MEDIA',
            payload: {
                id: currentMedia
            }
        })
        setDeleteOpen(false);
    }

    const handleDeleteMediaCancel = () => {
        setDeleteOpen(false);
    }

    useEffect(() => {
        setRows(Object.values(state.media));
    }, [state.media]);

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
                            handleEditMediaClick(e, cellValues);
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
            field: 'type',
            headerName: 'Type',
            width: 100,
            editable: false
        },
        {
            field: 'size',
            headerName: 'Size',
            width: 200,
            editable: false
        },
        {
            field: 'notes',
            headerName: 'Notes',
            width: 200,
            editable: false
        }
    ]

    return (
        <>
            <Grid container>
                <Grid item xs={11}>
                    <Button
                        variant="outlined"
                        onClick={handleAddMediaClick}
                        sx={{ m: 2 }}
                    >+ Add Media</Button>
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
                open={open}
            >
                <DialogTitle>Upload Media</DialogTitle>
                <DialogContent>
                    <Input type="file" onChange={handleFileChange}></Input>
                    <MediaTags
                        tags={tags}
                        setTags={setTags}
                    >

                    </MediaTags>
                    <DialogActions>
                        <Button variant="outlined" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button variant="outlined" onClick={handleUploadMedia}>Upload</Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>
            <Dialog
                open={editOpen}
            >
                <DialogTitle>Edit Media</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        id="notes"
                        label="notes"
                        fullWidth
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditMediaCancel}>Cancel</Button>
                    <Button onClick={handleSaveMedia}>Save</Button>
                    <Button
                        startIcon={<DeleteIcon/>}
                        color="error"
                        onClick={handleDeleteMedia}
                    >Delete</Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={deleteOpen}
            >
            <DialogTitle>
                Delete Media
            </DialogTitle>
            <DialogContent>
                Are you sure you want to delete this media?
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={handleDeleteMediaConfirm}
                >
                    yes
                </Button>
                <Button
                    onClick={handleDeleteMediaCancel}
                >
                    no
                </Button>
            </DialogActions>
            </Dialog>
        </>
    )

}

export default MediaServer;