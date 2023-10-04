import React, { useState, useEffect, createContext, useReducer } from 'react';
import axios from 'axios';

export const ConfigContext = createContext();

const reducer = (state, action) => {

    switch(action.type) {
        case 'CONFIGS': 
            console.log(`Setting configs to ${action.payload}`)
            return {
                configs:{
                ...action.payload
                },
                nextRequest: null
            }
        case 'SAVE_CONFIG':
            console.log(`Saving config ${action.payload.config.name}`)
            return {
                ...state,
                nextRequest: {
                    type: 'save',
                    name: action.payload.name,
                    data: action.payload.config
                }
            }
    }

}

const initialState = {
    nextRequest: null
}

const ConfigProvider = ({children}) => {

    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        console.log('Config Provider');
        axios.get(`${import.meta.env.VITE_API_URL}/config`).then(response => {
            dispatch({type:'CONFIGS', payload: response.data});
        })
    }, []);

    useEffect(() => {
        console.log(state);
        if(state.nextRequest && state.nextRequest.type === 'save') {
            axios.post(`${import.meta.env.VITE_API_URL}/config`, {name: state.nextRequest.name, data: state.nextRequest.data}).then(response => {
                console.log(response.data);
                dispatch({type: 'CONFIGS', payload: response.data});
            })
        }
    }, [state]);

    return (
        <ConfigContext.Provider value={[state, dispatch]}>
            {children}
        </ConfigContext.Provider>
    )

}

export default ConfigProvider;