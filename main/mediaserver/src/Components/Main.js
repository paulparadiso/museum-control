import React, { useContext } from 'react';
import { NavContext } from '../Contexts/NavProvider';
import Media from './Media';
import Playlists from './Playlists';
import Content from './Content';
import Devices from './Devices';
import SyncGroups from './SyncGroups';

const Main = props => {
    const {page} = useContext(NavContext);

    switch(page) {
        case 'media':
            return <Media/>
        case 'playlists':
            return <Playlists/>
        case 'devices':
            return <Devices/>
        case 'content':
            return <Content/>
        case 'sync':
            return <SyncGroups/>
    }

}

export default Main;