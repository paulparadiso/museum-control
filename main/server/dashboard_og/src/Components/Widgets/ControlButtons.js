import React, { useContext } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core';
import ButtonSet from './ButtonSet'
import Draggable from 'react-draggable';
import { validateUser } from '../../utils';

const useStyles = makeStyles({
    root: {
        maxWidth: 325,
        marginTop: 10,
        textAlign: 'center',
        float: 'left'
    }
})

const ControlButtons = props => {

    const classes = useStyles();

    if(!validateUser(props.permissions)) {
        return <></>
    }

    return (
        <Draggable>
            <Card
                variant="outlined"
                className={classes.root}
            >
                <CardContent>
                    <ButtonSet
                        label={props.label}
                        items={props.items}
                        topic={props.topic}
                    />
                </CardContent>
            </Card>
        </Draggable>
    )
}

export default ControlButtons;