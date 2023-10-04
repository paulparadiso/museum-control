import { createContext, useReducer, useEffect } from 'react'; 
import useWebSocket, { ReadyState } from 'react-use-websocket';

const WS_URL = 'ws://localhost:3030/mqtt';

export const MQTTContext = createContext();

const reducer = (state, action) => {
    
    switch(action.type) {
        case 'SEND_MQTT': 
            return {
                ...state,
                nextMessage: {
                    topic: action.payload.topic,
                    message: action.payload.message
                }
            }
        case 'SUBSCRIBE_TO_TOPIC':
            console.log(`Got request for topic: ${action.payload.topic}`);
            const nextState = {...state};
            if(!state.clients.hasOwnProperty(action.payload.topic)) {
                nextState.clients[action.payload.topic] = [action.payload.callback]
                nextState.sendMessage = {
                    type: 'SUBSCRIBE',
                    payload: {
                        topic: action.payload.topic
                    }
                }
            } else {
                nextState.clients[action.payload.topic].push(action.payload.callback);
            }
            nextState.clients[action.payload.topic].forEach(cb => {
                cb("Request received.");
            })
            return nextState;
        case 'MESSAGE_SENT':
            return {
                ...state, sendMessage: null
            }
        default:
            return state;
    }
}

const initialState = {clients: {}, sendMessage: null};

const MQTTProvider = ({children}) => {
    
    const [state, dispatch] = useReducer(reducer, initialState);

    const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(WS_URL, {
        onOpen: () => {
            console.log('Websocket connection established.');
        }
    });

    useEffect(() => {
        if(state.sendMessage != null) {
            sendJsonMessage(state.sendMessage);
            dispatch({
                type: 'MESSAGE_SENT',
                payload: null
            });
        }
    }, [state.sendMessage]);

    useEffect(() => {
        if(lastJsonMessage !== null) {
            console.log(lastJsonMessage);
            if(state.clients.hasOwnProperty(lastJsonMessage.topic)) {
                state.clients[lastJsonMessage.topic].forEach(cb => {
                    cb(lastJsonMessage.message, lastJsonMessage.topic);
                }
            )
            }
        }
    }, [lastJsonMessage]);

    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Open',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated'
    }[readyState];

    return (
        <MQTTContext.Provider value={[state, dispatch]}>
            {children}
        </MQTTContext.Provider>
    )

}

export default MQTTProvider;