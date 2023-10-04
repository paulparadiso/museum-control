import React, { useEffect, createContext, useReducer } from 'react';
import axios from 'axios';

export const DeviceContext = createContext();

//const API_URL = 'http://localhost:3333';
//const API_URL = process.env.API_URL;
const API_URL = import.meta.env.VITE_API_URL;

const reducer = (state, action) => {

    switch (action.type) {
        case 'SET_DEVICES':
            return {
                ...state,
                devices: action.payload.devices
            }
        case 'ADD_DEVICE':
            break;
        case 'UPDATE_DEVICE':
            return {
                ...state,
                nextProcess: 'updateDevice',
                data: action.payload
            }
        case 'CLEAR_NEXT_PROCESS':
            return {
                ...state,
                nextProcess: null
            }
        default:
            break;
    }
}

const initialState = {
    devices: [],
    nextProcess: null,
    data: null
}

const DeviceProvider = ({ children }) => {

    const [state, dispatch] = useReducer(reducer, initialState);

    const populateDevices = () => {
        axios.get(API_URL + '/document/read/device').then(response => {
            dispatch({
                type: 'SET_DEVICES',
                payload: {
                    devices: response.data.response.reduce((accumulator, device) => {
                        return {
                            ...accumulator, [device._id]: device
                        }
                    }, {})
                }
            });
        })
    }

    const updateDevice = data => {
        console.log(data);
        axios.post(API_URL + '/document/update/', {type: 'device', data: data}).then((response) => {
            console.log(response);
        })
    }

    useEffect(() => {
        populateDevices()
        setInterval(() => populateDevices(), 1000);
    }, []);

    useEffect(() => {
        if (state.nextProcess && state.nextProcess.process == 'upload') {
            upload(state.nextProcess.data);
        }
        if (state.nextProcess && state.nextProcess == 'updateDevice') {
            updateDevice(state.data);
        }
        dispatch({
            type: 'CLEAR_NEXT_PROCESS'
        })
    }, [state.nextProcess]);

    return (
        <DeviceContext.Provider value={[state, dispatch]}>
            {children}
        </DeviceContext.Provider>
    )

}

export default DeviceProvider;