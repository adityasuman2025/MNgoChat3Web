const defaultState = {
    snackBarCount: 0,
    snackBarMsg: null,
    snackBarType: "error",

    isCheckingLoginStatus: true,
    isSomeoneLoggedIn: false,
    checkLoginStatusError: null,
    userDetails: {},

    isLoggingUser: false,
    loginUserError: null,

    isRegisteringUser: false,
    isUserRegistered: false,
    registerUserError: null,

    isVerifyingPasscode: false,
    isPasscodeVerified: false,
    verifyPasscodeError: null,

    isGettingUserAllChats: false,
    getUserAllChatsError: null,
    userAllChats: {},

    isGettingAllUsers: false,
    getAllUsersError: null,
    allUsers: {},
}

const rootReducer = (state = defaultState, { type, payload = {} }) => {
    switch (type) {
        case 'SHOW_SNACKBAR': {
            console.log("SHOW_SNACKBAR");
            return {
                ...state,
                snackBarCount: state.snackBarCount + 1,
                snackBarMsg: payload.msg || null,
                snackBarType: payload.type || "error",
            }
        }

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

        case 'REGISTER_USER': {
            console.log("REGISTER_USER");
            return {
                ...state,
                isRegisteringUser: true,
                isUserRegistered: false,
                registerUserError: null,
            }
        }
        case 'REGISTER_USER_SUCCESS': {
            console.log("REGISTER_USER_SUCCESS");
            return {
                ...state,
                isRegisteringUser: false,
                isUserRegistered: true,
            }
        }
        case 'REGISTER_USER_FAILURE': {
            console.log("REGISTER_USER_FAILURE");
            return {
                ...state,
                isRegisteringUser: false,
                registerUserError: payload.msg,
            }
        }

        case 'VERIFY_PASSCODE': {
            console.log("VERIFY_PASSCODE");
            return {
                ...state,
                isVerifyingPasscode: true,
                isPasscodeVerified: false,
                verifyPasscodeError: null,
            }
        }
        case 'VERIFY_PASSCODE_SUCCESS': {
            console.log("VERIFY_PASSCODE_SUCCESS");
            return {
                ...state,
                isVerifyingPasscode: false,
                isPasscodeVerified: true,
            }
        }
        case 'VERIFY_PASSCODE_FAILURE': {
            console.log("VERIFY_PASSCODE_FAILURE");
            return {
                ...state,
                isVerifyingPasscode: false,
                verifyPasscodeError: payload.msg,
            }
        }

        case 'GET_USER_ALL_CHATS': {
            console.log("GET_USER_ALL_CHATS");
            return {
                ...state,
                isGettingUserAllChats: true,
                getUserAllChatsError: null,
                userAllChats: {},
            }
        }
        case 'GET_USER_ALL_CHATS_SUCCESS': {
            console.log("GET_USER_ALL_CHATS_SUCCESS");
            return {
                ...state,
                isGettingUserAllChats: false,
                userAllChats: payload.data || {},
            }
        }
        case 'GET_USER_ALL_CHATS_FAILURE': {
            console.log("GET_USER_ALL_CHATS_FAILURE");
            return {
                ...state,
                isGettingUserAllChats: false,
                getUserAllChatsError: payload.msg,
            }
        }

        case 'GET_ALL_USERS': {
            console.log("GET_ALL_USERS");
            return {
                ...state,
                isGettingAllUsers: true,
                getAllUsersError: null,
                allUsers: {},
            }
        }
        case 'GET_ALL_USERS_SUCCESS': {
            console.log("GET_ALL_USERS_SUCCESS");
            return {
                ...state,
                isGettingAllUsers: false,
                allUsers: payload.data || {},
            }
        }
        case 'GET_ALL_USERS_FAILURE': {
            console.log("GET_ALL_USERS_FAILURE");
            return {
                ...state,
                isGettingAllUsers: false,
                getAllUsersError: payload.msg,
            }
        }

        default: return state
    }
}

export default rootReducer;