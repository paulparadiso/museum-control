import React from 'react'
import ShowOnOffControl from './Widgets/ShowOnOffControl';
import MuteOnOffControl from './Widgets/MuteOnOffControl';
import DeviceStatusView from './Widgets/DeviceStatusView';
import DailySchedulerView from './Widgets/DailySchedulerView';
import UserContext from '../Contexts/UserContext';

const Main = props => {
    return (
        <UserContext.Provider value='admin'>
            <ShowOnOffControl/>
            <MuteOnOffControl/>
            <DeviceStatusView/>
            <DailySchedulerView/>
        </UserContext.Provider>
    )
}

export default Main;