import { createContext, useReducer, useEffect } from 'react';
import { fakeDevices } from '../../devData/fakeDevices';

export const FakeDataContext = createContext();

const reducer = (state, action) => {
    switch(action.TYPE) {

    }
}

const initialState = {
    'media': [

    ],
    'devices': fakeDevices
}

const FakeDataProvider = ({children}) => {

    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <FakeDataContext.Provider value={[state, dispatch]}>
            {children}
        </FakeDataContext.Provider>
    )

}

export default FakeDataProvider;