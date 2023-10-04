import React from 'react';
import axios from 'axios';
import { setAuthToken } from '../SetAuthToken';
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
import { makeStyles } from '@material-ui/core/styles';

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

const Login = props => {

    const classes = useStyles();

    const handleSubmit = (email, password) => {
        
        const loginPayload = {
            username: 'user',
            password: 'password'
        }

        axios.post("https://reqres.in/api/login", loginPayload)
            .then(response => {
                const token = response.data.token;

                localStorage.setItem("token", token);

                setAuthToken(token);

                window.location.href = '/'
            })
            .catch(err => console.log(err));
    }

    return (
        <Card
            variant="outlined"
            className={classes.root}
        >
            <CardContent>
                <form onSubmit={(event) => {
                    event.preventDefault()
                    const [username, password] = event.target.children;
                    handleSubmit(username, password);
                }}>
                    <FormControl>
                        <InputLabel htmlFor="username">Username</InputLabel>
                        <Input id="username" aria-describedby="username-text"/>
                        <FormHelperText id="username-text">Enter Username</FormHelperText>
                    </FormControl>
                    <br/>
                    <FormControl>
                        <InputLabel htmlFor="password">Password</InputLabel>
                        <Input id="password" aria-describedby="password-text" type="password"/>
                        <FormHelperText id="password-text"></FormHelperText>
                    </FormControl>
                    <br/>
                    <Button className={classes.buttons} variant="contained" type="submit">Submit</Button>
                </form>
            </CardContent>
        </Card>
    )

}

export default Login;