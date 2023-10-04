import { useContext } from 'react';
import UserContext from './Contexts/UserContext';

export const validateUser = permissions => {

    const currentUser = useContext(UserContext);
    if(permissions === [] || permissions === null || currentUser === 'all' || permissions.includes(currentUser)) {
        return true;
    }
    return false;

}