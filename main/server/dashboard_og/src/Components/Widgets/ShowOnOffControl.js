import React from 'react';
import ControlButtons from './ControlButtons';
import { MUSEUM_SHOW_STATUS } from '../../Topics'

const ShowOnOffControl = props => {

    return (
        <ControlButtons
            label="Show On/Off"
            items={['on', 'off']}
            topic={MUSEUM_SHOW_STATUS}
            permissions={['admin']}
        />
    )
}

export default ShowOnOffControl;