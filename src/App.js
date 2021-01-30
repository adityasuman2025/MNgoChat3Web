import React from 'react';
import { Provider } from 'react-redux';

import store from './redux/store';
import Routes from './Routes';
import SnackBarWrapper from './components/SnackBarWrapper';


function App() {
    return (
        <Provider store={store}>
            <SnackBarWrapper>
                <Routes />
            </SnackBarWrapper>
        </Provider>
    )
}

export default App;