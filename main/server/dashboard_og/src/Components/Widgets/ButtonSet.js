import React from 'react';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import { useMutation } from '@apollo/client';
import { SEND_MQTT_MESSAGE } from '../../GraphqlQueries';

const useStyles = makeStyles({
    root: {
        maxWidth: 325,
        margin: 10,
        textAlign: 'center',
    },
    buttonContainer: {
        width: '57vw',
        textAlign: 'right'
    },
    left: {
        width: '45%',
        float: 'left',
    },
    buttons: {
        margin: 10,
    },
    right: {
        width: '45%',
        float: 'right'
    }
});

const ButtonSet = props => {

    const classes = useStyles();
    const [sendMQTTMessage] = useMutation(SEND_MQTT_MESSAGE);

    const mutateMQTT = (message) => {
        sendMQTTMessage({
            'variables': {
                'topic': props.topic,
                'message': message
            }
        })
    }

    return (
        <React.Fragment>
            {props.label}
            {
                props.items.map((item, index) => {
                    return (
                        <Button
                            variant="contained"
                            color="primary"
                            key={`button-${index}`}
                            className={classes.buttons}
                            onClick={() => mutateMQTT(item)}
                        >
                            {item.toUpperCase()}
                        </Button>
                    )
                })
            }
        </React.Fragment>
    )

}

export default ButtonSet;