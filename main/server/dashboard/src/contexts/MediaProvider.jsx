import React, { useEffect, createContext, useReducer } from 'react';
import axios from 'axios';

export const MediaContext = createContext();

//const API_URL = 'http://localhost:3333';
//const API_URL = process.env.API_URL;
const API_URL = import.meta.env.VITE_API_URL;

const reducer = (state, action) => {
    switch(action.type) {
        case 'UPLOAD_MEDIA': {
            return {
                ...state, nextProcess: {
                    process: 'upload',
                    data: {
                        ...action.payload
                    }
                }
            }
        }
        case 'POPULATE_MEDIA': {
            return {
                ...state,
                nextProcess: {
                    process: 'populate'
                }
            }
        }
        case 'SET_MEDIA': {
            return {
                ...state,
                media: {
                    ...action.payload.media
                }
            }
        }
        case 'DELETE_MEDIA': {
            console.log(`Delete media:${action.payload.id}`)
            return {
                ...state,
                nextProcess: {
                    process: 'deleteMedia',
                    data: action.payload.id
                }
            }
        }
        case 'CREATE_PROGRESS': {
            return {
                ...state,
                notifications: {
                    ...state.notifications,
                    [action.payload.name]: {
                        progress: 0
                    }
                }
            }
        }
        case 'UPDATE_PROGRESS': {
            return {
                ...state, 
                notifications: {
                    ...state.notifications,
                    [action.payload.filename]: {
                        progress: action.payload.progress
                    }
                }
            }
        }
        case 'REMOVE_PROGRESS': {
            const item = action.payload.name;
            const { [item]:name, ...rest } = state.notifications;
            return {
                ...state,
                notifications: {
                    ...rest
                }
            }
        }
        case 'RESET_PROCESS': {
            return {
                ...state,
                nextProcess: null
            }
        }
        default: {
            return state;
        }
    }
}

const initialState = {
    media: {},
    uploads: [],
    nextProcess: null,
    notifications: {}
}

const MediaProvider = ({children}) => {

    const [state, dispatch] = useReducer(reducer, initialState);

    const populateMedia = () => {
        axios.get(API_URL + '/document/read/media').then(response => {
            dispatch({
                type: 'SET_MEDIA',
                payload: {
                    media: response.data.response.reduce((accumulator, media) => {
                        return {
                            ...accumulator, [media._id]: media
                        }
                    }, {})
                }
            });
        })
    }

    const handleUploadProgress = (filename, progressEvent) => {
        const progress = Math.round((progressEvent.loaded * 100.0) / progressEvent.total);
        console.log(`${filename}: ${progress}`);
        dispatch({
            type: 'UPDATE_PROGRESS',
            payload: {
                filename: filename,
                progress: progress
            }
        })
    }

    const handleUploadComplete = (filename) => {
        console.log(`${filename}: Upload complete.`);
        dispatch({
            type: 'REMOVE_PROGRESS',
            payload: {
                name: filename
            }
        })
    }

    const createNotification = filename => {
        dispatch({
            type: 'CREATE_PROGRESS',
            payload: {
                name: filename
            }
        });
    }

    const removeNotification = filename => {

    }

    const upload = (fileData) => {
        console.log(fileData);
        let formData = new FormData;
        formData.append('file', fileData.file);
        formData.append('tags', fileData.tags)
        let config = {
            onUploadProgress: (event) => handleUploadProgress(fileData.file.name, event),
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
        createNotification(fileData.file.name);
        axios.post(API_URL + '/upload', formData, config).then((response) => {
            console.log(response);
            handleUploadComplete(fileData.file.name);
        }).catch((error) => {
            console.log(error);
        })
    }

    const deleteMedia = (id) => {
        console.log(`Posting delete request: ${id}`)
        axios.post(API_URL + '/document/delete', {type: 'media', id: id}).then(response => {
            console.log(response);
        });
    }

    useEffect(() => {
        setInterval(() => populateMedia(), 1000);
    }, []);

    useEffect(() => {   
        if(state.nextProcess && state.nextProcess.process == 'upload') {
            upload(state.nextProcess.data);
        }
        if(state.nextProcess && state.nextProcess.process === 'deleteMedia') {
            console.log(`Calling delete ${state.nextProcess.data}`);
            deleteMedia(state.nextProcess.data);
        }
    }, [state.nextProcess]);


    return (
        <MediaContext.Provider value={[state, dispatch]}>
            {children}
        </MediaContext.Provider>
    )

}

export default MediaProvider;