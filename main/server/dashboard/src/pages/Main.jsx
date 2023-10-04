import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Dashboard from './Dashboard';
import Media from './Media';
import Devices from './Devices';
import Status from './Status';
import Config from './Config';
import Video from './Video';
import SyncGroups from './SyncGroups';

const Main = () => {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route path="/dashboard" element={<Dashboard />}/>
                    <Route path="/media" element={<Media />}/>
                    <Route path="/devices" element={<Devices />}/>
                    <Route path='/status' element={<Status />}/>
                    <Route path='/syncgroups' element={<SyncGroups />}/>
                    <Route path='/config' element={<Config />} />
                    <Route path='/video' element={<Video />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )

}

export default Main;