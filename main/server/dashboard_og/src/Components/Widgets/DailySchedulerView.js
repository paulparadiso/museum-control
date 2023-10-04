import React, { useState } from 'react';
import {
    FormControl,
    FormGroup,
    FormControlLabel,
    Switch,
    InputLabel,
    Input,
    FormHelperText,
    Button
} from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Draggable from 'react-draggable';
import { makeStyles } from '@material-ui/core/styles';
import { useQuery, useMutation } from '@apollo/client';
import { GET_MQTT_MESSAGE, SEND_MQTT_MESSAGE } from '../../GraphqlQueries';

const useStyles = makeStyles({
    root: {
        maxWidth: 325,
        margin: 'auto',
        marginTop: 10,
        textAlign: 'center',
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
    consoleLine: {
        margin: 0,
        paddingTop: 0,
        paddingBottom: 0,
    },
    pos: {
        marginBottom: 23,
    },
});

const DailySchedulerView = props => {

    const classes = useStyles();

    let changedOnTime = null;
    let changedOffTime = null;
    const [schedulerData, setSchedulerData] = useState({})

    const { loading, error, data } = useQuery(GET_MQTT_MESSAGE, 
                                                {'variables': {'topic': 'museum/apps/dailyscheduler/params/current'}, 
                                                 'pollInterval': 1000,
                                                 'onCompleted': data => {
                                                    setSchedulerData(JSON.parse(data.getMQTTMessage));
                                                }});
    
    const [setOnOffTimes] = useMutation(SEND_MQTT_MESSAGE);
    const mutateTimes = () => {
        setOnOffTimes({
            'variables': {
                'onTime': changedOnTime === null ? schedulerData.onTime : changedOnTime,
                'offTime': changedOffTime === null ? schedulerData.offTime : changedOffTime,
                'enabled': schedulerData.enabled
            }
        });
    }

    const toggleSchedulerEnabled = () => {
        if(schedulerData.enabled === 'true') {
            schedulerData.enabled = 'false';
        } else {
            schedulerData.enabled = 'true';
        }
    }

    if(loading) return <></>;

    return (
        <Draggable>
            <Card
                variant="outlined"
                className={classes.root}
            >
                <CardContent>
                    <FormGroup>
                        <FormControlLabel
                            control={<Switch size="small" checked={schedulerData.enabled === 'true'} onChange={() => toggleSchedulerEnabled()} />}
                            label={props.schedulerState ? 'Turn Scheduler Off' : 'Turn Scheduler On'}
                        >
                        </FormControlLabel>
                    </FormGroup>
                    <form onSubmit={e => {
                        e.preventDefault();
                        mutateTimes();
                    }}
                    >
                        <FormControl>
                            <InputLabel htmlFor="on">{schedulerData.onTime}</InputLabel>
                            <Input id="on" aria-describedby="on-text" onChange={e => changedOnTime = e.target.value} />
                            <FormHelperText id="on-text">Change show on time.</FormHelperText>
                        </FormControl>
                        <br />
                        <FormControl>
                            <InputLabel htmlFor="off">{schedulerData.offTime}</InputLabel>
                            <Input id="off" aria-describedby="off-text" onChange={e => changedOffTime = e.target.value} />
                            <FormHelperText id="off-text">Change show off time.</FormHelperText>
                        </FormControl>
                        <br />
                        <Button className={classes.buttons} variant="contained" type="submit">Submit</Button>
                    </form>
                </CardContent>
            </Card>
        </Draggable>
    )
}

export default DailySchedulerView;