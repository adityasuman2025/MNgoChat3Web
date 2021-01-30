import {
    LOGGED_USER_TOKEN_COOKIE_NAME,
    SOMETHING_WENT_WRONG_ERROR,
} from "../../constants";
import { getCookieValue, makeCookie } from "../../utils";
import {
    getUserDetails,
    VerifyLogin,
    registerNewUser,
} from "../../apis";

export const showSnackBarAction = (msg, type) => async (dispatch) => {
    dispatch({ type: 'SHOW_SNACKBAR', payload: { msg, type } });
}

export const checkLoginStatusAction = () => async (dispatch) => {
    dispatch({ type: 'CHECK_LOGIN_STATUS' });
    try {
        const cookieValue = await getCookieValue(LOGGED_USER_TOKEN_COOKIE_NAME);
        if (cookieValue) {
            const response = await getUserDetails(cookieValue);
            if (response.statusCode === 200) {
                const userDetails = response.data;
                dispatch({ type: 'CHECK_LOGIN_STATUS_SUCCESS', payload: { userDetails } });
            } else {
                dispatch({ type: 'CHECK_LOGIN_STATUS_FAILURE', payload: response });
            }
        } else {
            dispatch({ type: 'CHECK_LOGIN_STATUS_FAILURE' });
        }
    } catch {
        dispatch({ type: 'CHECK_LOGIN_STATUS_FAILURE', payload: SOMETHING_WENT_WRONG_ERROR });
    }
}

export const loginUserAction = (username, password) => async (dispatch) => {
    dispatch({ type: 'LOGIN_USER' });
    try {
        const response = await VerifyLogin(username, password);
        if (response.statusCode === 200) {
            const userDetails = response.data;
            const token = response.token;
            if (token) {
                //setting cookie
                const cookie = await makeCookie(LOGGED_USER_TOKEN_COOKIE_NAME, token);
                if (cookie) {
                    dispatch({ type: 'LOGIN_USER_SUCCESS', payload: { userDetails } });
                } else {
                    dispatch({ type: 'LOGIN_USER_FAILURE', payload: response });
                }
            } else {
                dispatch({ type: 'LOGIN_USER_FAILURE', payload: response });
            }
        } else {
            dispatch({ type: 'LOGIN_USER_FAILURE', payload: response });
        }
    } catch {
        dispatch({ type: 'LOGIN_USER_FAILURE', payload: SOMETHING_WENT_WRONG_ERROR });
    }
}

export const registerUserAction = (username, name, email, password, passcode) => async (dispatch) => {
    try {
        const response = await registerNewUser(username, name, email, password, passcode);
        dispatch({ type: 'REGISTER_USER', payload: response });
    } catch {
        dispatch({ type: 'REGISTER_USER', payload: SOMETHING_WENT_WRONG_ERROR });
    }
}