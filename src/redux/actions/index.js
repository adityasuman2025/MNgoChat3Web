import { LOGGED_USER_TOKEN_COOKIE_NAME, SOMETHING_WENT_WRONG_ERROR } from "../../constants";
import { getLoggedUserToken, makeCookie, logout } from "../../utils";
import {
    getUserDetails,
    verifyLogin,
    registerNewUser,
    verifyPassCode,
} from "../../apis";
import {
    doFirebaseAuth,
    checkUserExistsInFirebase,
    createUserInFirebase,
} from "../../firebaseQueries";

export const resetReducerStateAction = () => async (dispatch) => {
    dispatch({ type: 'RESET_REDUCER_STATE' });
}

export const showSnackBarAction = (msg, type) => async (dispatch) => {
    dispatch({ type: 'SHOW_SNACKBAR', payload: { msg, type } });
}

export const updateUserToProfileImgMappingAction = (payload) => async (dispatch) => {
    dispatch({ type: 'UPDATE_USER_TO_PROFILE_IMAGE_MAPPING', payload });
}

export const resetDataOfAChatRoomAction = () => async (dispatch) => {
    dispatch({ type: 'RESET_DATA_OF_A_CHAT_ROOM' });
}

export const checkLoginStatusAction = () => async (dispatch) => {
    dispatch({ type: 'CHECK_LOGIN_STATUS' });
    try {
        const loggedUserToken = getLoggedUserToken();
        if (loggedUserToken) {
            const response = await getUserDetails(loggedUserToken);
            if (response.statusCode === 200) {
                const userDetails = response.data;
                const username = userDetails.username;

                const firebaseAuthResp = await doFirebaseAuth(dispatch, username);
                if (firebaseAuthResp.statusCode === 200) {
                    const firebaseResponse = await checkUserExistsInFirebase(loggedUserToken);
                    if (firebaseResponse.statusCode === 200) {
                        dispatch({ type: 'CHECK_LOGIN_STATUS_SUCCESS', payload: { userDetails } });
                    } else {
                        const error = firebaseResponse.msg
                        if (error) {
                            dispatch({ type: 'CHECK_LOGIN_STATUS_FAILURE', payload: firebaseResponse });
                        } else {
                            const firebaseResponse2 = await createUserInFirebase(loggedUserToken, username);
                            if (firebaseResponse2.statusCode === 200) {
                                dispatch({ type: 'CHECK_LOGIN_STATUS_SUCCESS', payload: { userDetails } });
                            } else {
                                dispatch({ type: 'CHECK_LOGIN_STATUS_FAILURE', payload: firebaseResponse2 });
                            }
                        }
                    }
                } else {
                    dispatch({ type: 'CHECK_LOGIN_STATUS_FAILURE', payload: firebaseAuthResp });
                }
            } else {
                logout(dispatch);
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
                    await dispatch(checkLoginStatusAction());
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

export const setActiveUsersListAction = (payload) => async (dispatch) => {
    if (payload) {
        dispatch({ type: 'SET_ACTIVE_USERS_LIST', payload });
    }
}

export const getLastSeenOfAUserAction = (payload) => async (dispatch) => {
    if (payload) {
        dispatch({ type: 'GET_LAST_SEEN_OF_A_USER', payload });
    }
}

export const getMessagesOfAChatRoomAction = (payload) => async (dispatch) => {
    if (payload) {
        dispatch({ type: 'GET_MESSAGES_OF_A_CHAT_ROOM', payload });
    }
}
export const getMessagesOfAChatRoomSuccessAction = (payload) => async (dispatch) => {
    if (payload) {
        dispatch({ type: 'GET_MESSAGES_OF_A_CHAT_ROOM_SUCCESS', payload });
    }
}
export const getANewMessageOfAChatRoomSuccessAction = (payload) => async (dispatch) => {
    if (payload) {
        dispatch({ type: 'GET_A_NEW_MESSAGE_OF_A_CHAT_ROOM_SUCCESS', payload });
    }
}

export const getPaginatedMessagesAction = (payload) => async (dispatch) => {
    dispatch({ type: 'GET_PAGINATED_MESSAGES', payload });
}
export const getPaginatedMessagesSuccessAction = (payload) => async (dispatch) => {
    if (payload) {
        dispatch({ type: 'GET_PAGINATED_MESSAGES_SUCCESS', payload });
    }
}

export const getTypeStatusOfAUserSuccessAction = (payload) => async (dispatch) => {
    dispatch({ type: 'GET_TYPE_STATUS_OF_A_USER_SUCCESS', payload });
}

export const getUnreadMsgCountOfTheSecondUserAction = () => async (dispatch) => {
    dispatch({ type: 'GET_UNREAD_MSG_COUNT_OF_THE_SECOND_USER' });
}
export const getUnreadMsgCountOfTheSecondUserSuccessAction = (payload) => async (dispatch) => {
    dispatch({ type: 'GET_UNREAD_MSG_COUNT_OF_THE_SECOND_USER_SUCCESS', payload });
}

export const startANewChatRoomAction = () => async (dispatch) => {
    dispatch({ type: 'START_A_NEW_CHAT_ROOM' });
}
export const startANewChatRoomSuccessAction = (payload) => async (dispatch) => {
    if (payload) {
        dispatch({ type: 'START_A_NEW_CHAT_ROOM_SUCCESS', payload });
    }
}
export const startANewChatRoomFailureAction = (payload) => async (dispatch) => {
    if (payload) {
        dispatch({ type: 'START_A_NEW_CHAT_ROOM_FAILURE', payload });
    }
}

export const uploadImageInFirebaseAction = () => async (dispatch) => {
    dispatch({ type: 'UPLOAD_IMAGE_IN_FIREBASE' });
}
export const uploadImageInFirebaseSuccessAction = () => async (dispatch) => {
    dispatch({ type: 'UPLOAD_IMAGE_IN_FIREBASE_SUCCESS' });
}
export const uploadImageInFirebaseFailureAction = (payload) => async (dispatch) => {
    if (payload) {
        dispatch({ type: 'UPLOAD_IMAGE_IN_FIREBASE_FAILURE', payload });
    }
}