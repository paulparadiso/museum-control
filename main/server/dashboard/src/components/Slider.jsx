import React, { useContext, useState } from 'react';
import Slide from '@mui/material/Slide';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import { FakeDataContext } from '../contexts/FakeDataProvider';

const Slider = ({ children, open }) => {

    const fakeDataContext = useContext(FakeDataContext);

    const [state, setState] = useState({});

    const handleClick = () => {
        props.setSliderOpen(false);
    }

    return (
        <Slide
            direction="left"
            in={open}
        >
            {children}
        </Slide>
    )

}

export default Slider;