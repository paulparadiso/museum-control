import React, { useState, createContext } from 'react';

export const NavContext = createContext('');

const NavProvider = ({children}) => {

    const [page, setPage] = useState('media');

    console.log(page);

    return(
        <NavContext.Provider value={{page, setPage}}>
            {children}
        </NavContext.Provider>
    )

}

export default NavProvider    