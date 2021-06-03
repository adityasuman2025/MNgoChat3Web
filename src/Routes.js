import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

// import Landing from './pages/Landing';
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Home from "./pages/Home";
// import Chat from "./pages/Chat";
// import NewChat from "./pages/NewChat";
// import NotFound from './pages/NotFound';

//lazy loading split the main bundle into many parts
import LoadingAnimation from './components/LoadingAnimation';

const Landing = lazy(() => import('./pages/Landing'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Home = lazy(() => import('./pages/Home'));
const Chat = lazy(() => import('./pages/Chat'));
const NewChat = lazy(() => import('./pages/NewChat'));
const NotFound = lazy(() => import('./pages/NotFound'));

function Routes() {
    return (
        <BrowserRouter >
            <Suspense fallback={
                <LoadingAnimation dark loading />
            }>
                <Switch>
                    <Route exact path="/" component={Landing} />
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/register" component={Register} />
                    <Route exact path="/home" component={Home} />
                    <Route exact path="/chat/*" component={Chat} />
                    <Route exact path="/new-chat/*" component={NewChat} />

                    <Route path="*" component={NotFound} />
                </Switch>
            </Suspense>
        </BrowserRouter>
    );
}
export default Routes;