import {
    LOGGED_USER_TOKEN_COOKIE_NAME,
    SOMETHING_WENT_WRONG_ERROR,
} from "../../constants";
import { getCookieValue, makeCookie } from "../../utils";
import {
    getUserDetails,
    verifyLogin,
    registerNewUser,
    verifyPassCode,
} from "../../apis";
import {
    checkUserExistsInFirebase,
    createUserInFirebase,
} from "../../firebaseQueries";

export const showSnackBarAction = (msg, type) => async (dispatch) => {
    dispatch({ type: 'SHOW_SNACKBAR', payload: { msg, type } });
}

export const checkLoginStatusAction = () => async (dispatch) => {
    dispatch({ type: 'CHECK_LOGIN_STATUS' });
    try {
        const loggedUserToken = await getCookieValue(LOGGED_USER_TOKEN_COOKIE_NAME);
        if (loggedUserToken) {
            const response = await getUserDetails(loggedUserToken);
            if (response.statusCode === 200) {
                const userDetails = response.data;
                const username = userDetails.username;

                const firebaseResponse = await checkUserExistsInFirebase(loggedUserToken);
                if (firebaseResponse.statusCode === 200) {
                    console.log("user exists in firebase");
                    dispatch({ type: 'CHECK_LOGIN_STATUS_SUCCESS', payload: { userDetails } });
                } else {
                    const error = firebaseResponse.msg
                    if (error) {
                        dispatch({ type: 'CHECK_LOGIN_STATUS_FAILURE', payload: firebaseResponse });
                    } else {
                        const firebaseResponse2 = await createUserInFirebase(loggedUserToken, username);
                        console.log("user created in firebase");
                        if (firebaseResponse2.statusCode === 200) {
                            dispatch({ type: 'CHECK_LOGIN_STATUS_SUCCESS', payload: { userDetails } });
                        } else {
                            dispatch({ type: 'CHECK_LOGIN_STATUS_FAILURE', payload: firebaseResponse2 });
                        }
                    }
                }
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
        const response = await verifyLogin(username, password);
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
    dispatch({ type: 'REGISTER_USER' });
    try {
        const response = await registerNewUser(username, name, email, password, passcode);
        if (response.statusCode === 200) {
            dispatch({ type: 'REGISTER_USER_SUCCESS', payload: response });
        } else {
            dispatch({ type: 'REGISTER_USER_FAILURE', payload: response });
        }
    } catch {
        dispatch({ type: 'REGISTER_USER_FAILURE', payload: SOMETHING_WENT_WRONG_ERROR });
    }
}

export const verifyPasscodeAction = (loggedUserToken, passcode) => async (dispatch) => {
    dispatch({ type: 'VERIFY_PASSCODE' });
    try {
        const response = await verifyPassCode(loggedUserToken, passcode);
        if (response.statusCode === 200) {
            dispatch({ type: 'VERIFY_PASSCODE_SUCCESS', payload: response });
        } else {
            dispatch({ type: 'VERIFY_PASSCODE_FAILURE', payload: response });
        }
    } catch {
        dispatch({ type: 'VERIFY_PASSCODE_FAILURE', payload: SOMETHING_WENT_WRONG_ERROR });
    }
}

export const getUserAllChatsAction = () => async (dispatch) => {
    dispatch({ type: 'GET_USER_ALL_CHATS' });
}

export const getUserAllChatsSuccessAction = (payload) => async (dispatch) => {
    if (payload) {
        dispatch({ type: 'GET_USER_ALL_CHATS_SUCCESS', payload });
    }
}

export const getUserAllChatsFailureAction = (payload) => async (dispatch) => {
    if (payload) {
        dispatch({ type: 'GET_USER_ALL_CHATS_FAILURE', payload });
    }
}

export const getAllUsersAction = () => async (dispatch) => {
    dispatch({ type: 'GET_ALL_USERS' });
}

export const getAllUsersSuccessAction = (payload) => async (dispatch) => {
    if (payload) {
        dispatch({ type: 'GET_ALL_USERS_SUCCESS', payload });
    }
}

export const getAllUsersFailureAction = (payload) => async (dispatch) => {
    if (payload) {
        dispatch({ type: 'GET_ALL_USERS_FAILURE', payload });
    }
}