import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Landing from './pages/Landing';
import Login from "./pages/Login";
import Home from "./pages/Home";

import NotFound from './pages/NotFound';

const Routes = () => (
    <BrowserRouter >
        <Switch>
            <Route exact path="/" component={Landing} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/home" component={Home} />

            <Route path="*" component={NotFound} />
        </Switch>
    </BrowserRouter>
);

export default Routes;