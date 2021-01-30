const defaultState = {
    isCheckingLoginStatus: true,
    isSomeoneLoggedIn: false,
    userDetails: {},
    checkLoginStatusError: null,

    isLoggingUser: false,
    loginUserError: null,

    registerInfo: {},
}

const rootReducer = (state = defaultState, { type, payload = {} }) => {
    switch (type) {
        case 'CHECK_LOGIN_STATUS': {
            console.log("CHECK_LOGIN_STATUS");
            return {
                ...state,
                isCheckingLoginStatus: true,
                isSomeoneLoggedIn: false,
                checkLoginStatusError: null,
                userDetails: {},
            }
        }
        case 'CHECK_LOGIN_STATUS_SUCCESS': {
            const userDetails = payload.userDetails;
            let isSomeoneLoggedIn = false;
            if (userDetails) {
                isSomeoneLoggedIn = true;
            }

            console.log("CHECK_LOGIN_STATUS_SUCCESS");
            return {
                ...state,
                isCheckingLoginStatus: false,
                isSomeoneLoggedIn,
                userDetails: userDetails || {},
            }
        }
        case 'CHECK_LOGIN_STATUS_FAILURE': {
            console.log("CHECK_LOGIN_STATUS_FAILURE");
            return {
                ...state,
                isCheckingLoginStatus: false,
                checkLoginStatusError: payload.msg,
            }
        }

        case 'LOGIN_USER': {
            console.log("LOGIN_USER");
            return {
                ...state,
                isLoggingUser: true,
                isSomeoneLoggedIn: false,
                loginUserError: null,
                userDetails: {},
            }
        }

        case 'LOGIN_USER_SUCCESS': {
            const userDetails = payload.userDetails;
            let isSomeoneLoggedIn = false;
            if (userDetails) {
                isSomeoneLoggedIn = true;
            }

            console.log("LOGIN_USER_SUCCESS");
            return {
                ...state,
                isLoggingUser: false,
                isSomeoneLoggedIn,
                userDetails: userDetails || {},
            }
        }

        case 'LOGIN_USER_FAILURE': {
            console.log("LOGIN_USER_FAILURE");
            return {
                ...state,
                isLoggingUser: false,
                loginUserError: payload.msg,
            }
        }

        case 'REGISTER_USER': return { ...state, registerInfo: payload }

        default: return state
    }
}

export default rootReducer;