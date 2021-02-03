import { LOGGED_USER_TOKEN_COOKIE_NAME, SOMETHING_WENT_WRONG_ERROR } from "../../constants";
import { getLoggedUserToken, makeCookie, logout } from "../../utils";
import {
    getUserDetails,
    verifyLogin,
    registerNewUser,
    verifyPassCode,
} from "../../apis";
import {
    checkUserExistsInFirebase,
    createUserInFirebase,
    getChatRoomDetails,
} from "../../firebaseQueries";

export const showSnackBarAction = (msg, type) => async (dispatch) => {
    dispatch({ type: 'SHOW_SNACKBAR', payload: { msg, type } });
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
                logout();
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

export const getChatRoomDetailsAction = (chatRoomId) => async (dispatch) => {
    dispatch({ type: 'GET_CHAT_ROOM_DETAILS' });

    try {
        const loggedUserToken = getLoggedUserToken();

        const firebaseResponse = await getChatRoomDetails(chatRoomId);
        if (firebaseResponse.statusCode === 200) {
            const members = firebaseResponse.data.members;
            if (members) {
                if (loggedUserToken in members) {
                    dispatch({ type: 'GET_CHAT_ROOM_DETAILS_SUCCESS', payload: firebaseResponse });
                } else {
                    dispatch({ type: 'GET_CHAT_ROOM_DETAILS_FAILURE', payload: { msg: "This chat does not belong to you" } });
                }
            } else {
                dispatch({ type: 'GET_CHAT_ROOM_DETAILS_FAILURE', payload: { msg: "This chat does not belong to you" } });
            }
        } else {
            dispatch({ type: 'GET_CHAT_ROOM_DETAILS_FAILURE', payload: firebaseResponse });
        }
    } catch {
        dispatch({ type: 'GET_CHAT_ROOM_DETAILS_FAILURE', payload: SOMETHING_WENT_WRONG_ERROR });
    }
}

export const getActiveStatusOfAUserSuccessAction = (payload) => async (dispatch) => {
    if (payload) {
        dispatch({ type: 'GET_ACTIVE_STATUS_OF_A_USER_SUCCESS', payload });
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
export const getMessagesOfAChatRoomAllSuccessAction = (payload) => async (dispatch) => {
    dispatch({ type: 'GET_MESSAGES_OF_A_CHAT_ROOM_ALL_SUCCESS', payload });
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
    if (payload) {
        dispatch({ type: 'GET_TYPE_STATUS_OF_A_USER_SUCCESS', payload });
    }
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
export const uploadImageInFirebaseSuccessAction = (payload) => async (dispatch) => {
    if (payload) {
        dispatch({ type: 'UPLOAD_IMAGE_IN_FIREBASE_SUCCESS', payload });
    }
}
export const uploadImageInFirebaseFailureAction = (payload) => async (dispatch) => {
    if (payload) {
        dispatch({ type: 'UPLOAD_IMAGE_IN_FIREBASE_FAILURE', payload });
    }
}