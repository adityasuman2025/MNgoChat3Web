import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Landing from './pages/Landing';
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import NewChat from "./pages/NewChat";

import NotFound from './pages/NotFound';

const Routes = () => (
    <BrowserRouter >
        <Switch>
            <Route exact path="/" component={Landing} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/home" component={Home} />
            <Route exact path="/chat/:chatRoomId" component={Chat} />
            <Route exact path="/new-chat/:selectedUserDetails" component={NewChat} />

            <Route path="*" component={NotFound} />
        </Switch>
    </BrowserRouter>
);

export default Routes;