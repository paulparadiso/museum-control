import { createContext, useReducer, useEffect } from 'react'
import axios from 'axios';

const API_URL = 'http://localhost:3005';

export const APIContext = createContext();

const getEverything = () => {
    return axios.get(API_URL + '/everything')
        .then(response => response.data);
}

const get = (property, id) => {

}

const update = (args) => {
    console.log(args);
    axios.post(API_URL + `/${args.model}/update`, { data: args.data });
}

const create = (args) => {
    axios.post(API_URL + `/${args.model}/create`, { data: args.data });
}

const remove = (args) => {
    axios.post(API_URL + `/${args.model}/delete`, { data: args.data });
}

const upload = (args) => {
    let formData = new FormData;
    formData.append('file', args.file);
    let config = {
        onUploadProgress: args.handleUploadProgress,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    }
    axios.post(API_URL + '/upload', formData, config).then((response) => {
        console.log(response);
        args.downloadComplete();
    }).catch((error) => {
        console.log(error);
    })

}

const syncPlayers = () => {
    axios.post(API_URL + '/syncplayers')
        .then(response => {
            console.log(response);
        })
        .catch(error => {
            console.log(error);
        })
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_ALL':
            let dataArr = action.payload;
            if(dataArr.devices) {
                dataArr.devices.sort((a,b) => {
                    return a.hostname.localeCompare(b.hostname);
                });
            }
            return dataArr;
        case 'UPDATE':
            update(action.payload);
            return state;
        case 'CREATE':
            create(action.payload);
            return state
        case 'REMOVE':
            remove(action.payload);
            return state
        case 'UPLOAD':
            upload(action.payload);
            return state
        case 'SYNC':
            syncPlayers();
            return state;
        default:
            return state
    }
}

const APIProvider = ({ children }) => {

    const [state, dispatch] = useReducer(reducer, { 'devices': [], 'media': [], 'playlists': [], 'content': [] });

    useEffect(() => {
        setInterval(() => {
            getEverything()
                .then(data => {
                    dispatch({ type: 'SET_ALL', payload: data });
                });
        }, 1000);
    }, []);

    return (
        <APIContext.Provider value={[state, dispatch]}>
            {children}
        </APIContext.Provider>

    );
}

export default APIProvider;
