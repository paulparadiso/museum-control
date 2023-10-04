import React, { useContext } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ThumbDownRoundedIcon from '@mui/icons-material/ThumbDownRounded';
import ThumbUpRoundedIcon from '@mui/icons-material/ThumbUpRounded';

const Status = () => {

    return (
        <Grid item xs={12} md={8} lg={9}>
            <Paper
                sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    textAlign: 'left',
                }}
            >
                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                    Status
                </Typography>
                <Grid item xs={12}>
                <Typography component="span" color="secondary" gutterBottom>
                    DB Connected:
                </Typography>
                <ThumbDownRoundedIcon color="error"/>
                </Grid>
                <Grid item xs={12}>
                <Typography component="span" color="secondary" gutterBottom>
                    MQTT Connected:
                </Typography>
                <ThumbUpRoundedIcon color="success"/>
                </Grid>
            </Paper>
        </Grid>
    )

}

export default Status