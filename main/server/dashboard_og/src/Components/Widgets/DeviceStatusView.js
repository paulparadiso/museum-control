import React, { useState } from 'react';
import {
    List,
    ListItem,
} from '@material-ui/core';
import Brightness1RoundedIcon from '@material-ui/icons/Brightness1Rounded'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import { useQuery } from '@apollo/client';
import { GET_MQTT_MESSAGE } from '../../GraphqlQueries';
import Draggable from 'react-draggable';
import { MQTT_SHOW_DEVICES_STATUS } from '../../Topics';

const useStyles = makeStyles({
    root: {
        minWidth: 700,
        marginTop: 10,
        textAlign: 'center',
        float: 'left'
    },
    header: {
        width: '100%',
        marginBottom: 20,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.0)',
    },
    buttons: {
        margin: 10,
    },
    icon: {
        margin: 0
    },
    title: {
        fontSize: 14,
        width: '50%',
    },
    console: {
        height: 400,
        backgroundColor: 'black',
        color: 'green',
        overflow: 'auto',
    },
    deviceIcon: {
        marginLeft: 10,
    },
    consoleLine: {
        margin: 0,
        paddingTop: 0,
        paddingBottom: 0,
    },
    pos: {
        marginBottom: 23,
    },
});

const DeviceStatusView = props => {

    let statusList;

    const classes = useStyles();
    const [statuses, setStatuses] = useState([]);
    const { data } = useQuery(GET_MQTT_MESSAGE,
        {
            variables: { 'topic': MQTT_SHOW_DEVICES_STATUS },
            pollInterval: 500, onCompleted: () => updateStatuses()
        });

    const updateStatuses = () => {
        const incomingMessage = JSON.parse(data.getMQTTMessage)
        
        for (let i = 0; i < statuses.length; i++) {
            if (statuses[i].name === incomingMessage.name) {
                statuses[i].status = incomingMessage.status;
                setStatuses([...statuses]);
                return;
            }
        }
        setStatuses([...statuses, JSON.parse(data.getMQTTMessage)]);
    }

    statusList = statuses.map((s, i) => {
        if(s === null) return [];
        const color = s.status === 'true' ? 'green' : 'red';
        return (
            <ListItem >
                {s.name}
                <Brightness1RoundedIcon
                    className={classes.deviceIcon}
                    style={{ color: color }}
                />
            </ListItem>
        );
    });

    return (
        <Draggable>
            <Card
                variant="outlined"
                className={classes.root}
            >
                <CardContent>
                    <List>
                        {statusList}
                    </List>
                </CardContent>
            </Card>
        </Draggable>
    )
}

export default DeviceStatusView;