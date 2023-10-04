import React, { useEffect, createContext, useReducer } from 'react'
import axios from 'axios';

export const SyncGroupContext = createContext();

//const API_URL = 'http://localhost:3333';
//const API_URL = process.env.API_URL;
const API_URL = import.meta.env.VITE_API_URL;

const reducer = (state, action) => {
    switch(action.type) {
        case 'SET_SYNC_GROUPS': {
            return {
                ...state,
                syncGroups: {
                    ...action.payload.syncGroups
                }
            }
        }
        case 'CREATE_SYNC_GROUP': {
            
            return {
                ...state,
                nextProcess: {
                    process: 'createSyncGroup',
                    data: action.payload
                }
            }
        }
        case 'UPDATE_SYNC_GROUP': {
            return {
                ...state,
                nextProcess: {
                    process: 'updateSyncGroup',
                    data: action.payload
                }
            }

        }
        case 'TRIGGER_SYNC_GROUP': {
            return {
                ...state,
                nextProcess: {
                    process: 'triggerSyncGroup',
                    data: action.payload
                }
            }
        }
        case 'DELETE_SYNC_GROUP': {
            return {
                ...state,
                nextProcess: {
                    process: 'deleteSyncGroup',
                    data: action.payload
                }
            }
        }
        default:
            return state
    }

}

const initialState = {
    syncGroups: {},
    nextProcess: null
}

const SyncGroupProvider = ({children}) => {

    const [state, dispatch] = useReducer(reducer, initialState);

    const populateSyncGroups = () => {
        axios.get(API_URL + '/document/read/syncGroup').then(response => {
            dispatch({
                type: 'SET_SYNC_GROUPS',
                payload: {
                    syncGroups: response.data.response.reduce((accumulator, syncGroup) => {
                        return {
                            ...accumulator, [syncGroup._id]: syncGroup
                        }
                    }, {})
                }
            });
        })
    }

    const createSyncGroup = data => {
        console.log(`Creating sync group ${data}`);
        axios.post(API_URL + '/document/create', {type: 'syncGroup', data: data}).then(response => {
            console.log(response);
        })
    }

    const updateSyncGroup = data => {
        axios.post(API_URL + '/document/update', {type: 'syncGroup', data: data}).then(response => {
            console.log(response);
        })
    }

    const triggerSyncGroup = data => {
        axios.post(API_URL + '/syncGroup/trigger', {data: data}).then(response => {
            console.log(response);
        })
    }

    const deleteSyncGroup = data => {
        axios.post(API_URL + 'document/delete', {type: 'syncGroup', data: data}).then(response => {
            console.log(response);
        })
    }

    useEffect(() => {
        if(state.nextProcess && state.nextProcess.process) {
            switch (state.nextProcess.process) {
                case 'createSyncGroup': {
                    createSyncGroup(state.nextProcess.data);
                    break;
                }
                case 'updateSyncGroup': {
                    updateSyncGroup(state.nextProcess.data);
                    break;
                }
                case 'triggerSyncGroup': {
                    triggerSyncGroup(state.nextProcess.data);
                    break;
                }
                case 'deleteSyncGroup': {
                    deleteSyncGroup(state.nextProcess.data);
                    break;
                }
                default: {
                    break;
                }
            }
        }
    }, [state.nextProcess]);

    useEffect(() => {
        setInterval(() => populateSyncGroups(), 1000);
    }, []);

    return (
        <SyncGroupContext.Provider value={[state, dispatch]}>
            {children}
        </SyncGroupContext.Provider>
    )

}

export default SyncGroupProvider;