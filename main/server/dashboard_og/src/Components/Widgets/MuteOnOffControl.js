import React from 'react';
import ControlButtons from './ControlButtons';
import { MUSEUM_SHOW_MUTE } from '../../Topics';

const MuteOnOff = props => {

    return (
        <ControlButtons
            label="Mute On/Off"
            items={['on', 'off']}
            topic={MUSEUM_SHOW_MUTE}
            permissions={['all']}
        />
    )
}

export default MuteOnOff;