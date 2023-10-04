import React, { useState, useEffect, createContext } from 'react';
import axios from 'axios';

//const STATUS_URL = 'http://localhost:3333/status'
//const STATUS_URL = `${process.env.API_URL}/status`;
const STATUS_URL = `${import.meta.env.VITE_API_URL}/status`;

export const StatusContext = createContext();

const initialState = {
    dbConnected: false,
    mqttConnected: false
}

const StatusProvider = ({children}) => {

    const [status, setStatus] = useState(initialState);

    useEffect(() => {
        axios.get(STATUS_URL).then(response => {
            console.log(response.data);
            setStatus({dbConnected: response.dbConnected, mqttConnected: response.mqttConnected});
        })
    }, [])

    return (
        <StatusContext.Provider value={[status]}>
            {children}
        </StatusContext.Provider>
    )

}

export default StatusProvider;