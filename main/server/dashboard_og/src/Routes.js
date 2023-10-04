import React from 'react';
import { Redirect, Switch, Route, Router } from 'react-router-dom';
import { history } from './History';
import Main from './Components/Main';
import Login from './Components/Login';
import RouteGuard from './Components/RouteGuard';

const Routes = () => {

    return (

        <Router history={history}>
            <Switch>
                <RouteGuard
                    exact 
                    path="/"
                    component={Main}
                />
                <Route
                    exact
                    path="/login"
                    component={Login}
                />
                <Redirect to="/" />
            </Switch>
        </Router>

    )

}

export default Routes;