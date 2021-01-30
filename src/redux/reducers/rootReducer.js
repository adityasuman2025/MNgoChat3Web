const defaultState = {
    isCheckingLoginStatus: true,
    isSomeoneLoggedIn: false,
    userDetails: {},
    checkLoginStatusError: null,

    loginInfo: {},
    registerInfo: {},
}

const rootReducer = (state = defaultState, { type, payload = {} }) => {
    switch (type) {
        case 'CHECK_LOGIN_STATUS': {
            return {
                ...state,
                isCheckingLoginStatus: true,
                isSomeoneLoggedIn: false,
                userDetails: {},
                checkLoginStatusError: null,
            }
        }
        case 'CHECK_LOGIN_STATUS_SUCCESS': {
            const userDetails = payload.user_details;
            let isSomeoneLoggedIn = false;
            if (userDetails) {
                isSomeoneLoggedIn = true;
            }

            return {
                ...state,
                isCheckingLoginStatus: false,
                isSomeoneLoggedIn,
                userDetails: userDetails || {},
            }
        }
        case 'CHECK_LOGIN_STATUS_FAILURE': {
            return {
                ...state,
                isCheckingLoginStatus: false,
                checkLoginStatusError: payload.msg,
            }
        }

        case 'LOGIN_USER': {
            return {
                ...state,
                loginInfo: payload,
            }
        }

        case 'REGISTER_USER': return { ...state, registerInfo: payload }

        default: return state
    }
}

export default rootReducer;