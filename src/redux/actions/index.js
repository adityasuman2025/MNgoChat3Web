import {
    LOGGED_USER_TOKEN_COOKIE_NAME,
    SOMETHING_WENT_WRONG_ERROR,
} from "../../constants";
import { getCookieValue } from "../../utils";
import {
    getUserDetails,
    VerifyLogin,
    registerNewUser,
} from "../../apis";

export const checkLoginStatusAction = () => async (dispatch) => {
    dispatch({ type: 'CHECK_LOGIN_STATUS' });
    try {
        const cookieValue = getCookieValue(LOGGED_USER_TOKEN_COOKIE_NAME);
        if (cookieValue) {
            const response = await getUserDetails(cookieValue);
            if (response.statusCode === 200) {
                dispatch({ type: 'CHECK_LOGIN_STATUS_SUCCESS', payload: response });
            } else {
                dispatch({ type: 'CHECK_LOGIN_STATUS_FAILURE', payload: response });
            }
        } else {
            dispatch({ type: 'CHECK_LOGIN_STATUS_FAILURE', payload: { msg: null } });
        }
    } catch {
        dispatch({ type: 'CHECK_LOGIN_STATUS_FAILURE', payload: SOMETHING_WENT_WRONG_ERROR });
    }
}

export const loginUserAction = (username, password) => async (dispatch) => {
    try {
        const response = await VerifyLogin(username, password);
        dispatch({ type: 'LOGIN_USER', payload: response });
    } catch {
        dispatch({ type: 'LOGIN_USER', payload: SOMETHING_WENT_WRONG_ERROR });
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