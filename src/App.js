import React from 'react';
import { Provider } from 'react-redux';

import store from './redux/store';
import Routes from './Routes';
import RootWrapper from './RootWrapper';

function App() {
    return (
        <Provider store={store}>
            <RootWrapper>
                <Routes />
            </RootWrapper>
        </Provider>
    )
}

export default App;