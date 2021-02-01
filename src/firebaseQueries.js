import firebase from './FirebaseConfig';

import { LOGGED_USER_TOKEN_COOKIE_NAME } from "./constants";
import { getCookieValue } from "./utils";
import {
    getUserAllChatsAction,
    getUserAllChatsSuccessAction,
    getUserAllChatsFailureAction,

    getAllUsersAction,
    getAllUsersSuccessAction,
    getAllUsersFailureAction,

    getActiveStatusOfAUserSuccessAction,

    getMessagesOfAChatRoomAction,
    getMessagesOfAChatRoomSuccessAction,
} from "./redux/actions/index";

export async function checkUserExistsInFirebase(loggedUserToken) {
    let toReturn = { statusCode: 500, data: false, msg: "" };

    const usersDbRef = firebase.app().database().ref('users/');
    await usersDbRef
        .child(loggedUserToken)
        .once('value')
        .then(async resp => {
            const response = resp.val();
            if (response) {
                toReturn.statusCode = 200;
                toReturn.data = true;
            }
        })
        .catch(error => {
            toReturn.msg = error.message;
        });

    return toReturn;
}

export async function createUserInFirebase(loggedUserToken, username) {
    let toReturn = { statusCode: 500, data: false, msg: "" };

    const usersDbRef = firebase.app().database().ref('users/');
    await usersDbRef
        .child(loggedUserToken)
        .set({
            "userToken": loggedUserToken,
            "username": username,
            "isActive": false,
            "lastActive": (new Date()).toString(),
            "userChatRooms": {}
        },
            (error) => {
                try {
                    if (error) {
                        toReturn.msg = error.message;
                    } else {
                        toReturn.statusCode = 200;
                        toReturn.data = true;
                    }
                } catch (error) {
                    toReturn.msg = error.message;
                }
            });

    return toReturn;
}

export async function getUserChatRooms(dispatch) {
    const loggedUserToken = getCookieValue(LOGGED_USER_TOKEN_COOKIE_NAME);
    if (!loggedUserToken) {
        return
    }

    dispatch(getUserAllChatsAction());

    const usersDbRef = firebase.app().database().ref('users/' + loggedUserToken + "/userChatRooms");
    usersDbRef
        .on('value',
            function(snap) {
                const response = snap.val();
                if (response) {
                    dispatch(getUserAllChatsSuccessAction({ data: response }));
                }
            },
            error => {
                dispatch(getUserAllChatsFailureAction({ msg: error.message }));
            });
}

export async function getAllUsers(dispatch) {
    const loggedUserToken = getCookieValue(LOGGED_USER_TOKEN_COOKIE_NAME);
    if (!loggedUserToken) {
        return
    }

    dispatch(getAllUsersAction());

    const usersDbRef = firebase.app().database().ref('users/');
    usersDbRef
        .once('value')
        .then(async resp => {
            const response = resp.val();
            if (response) {
                dispatch(getAllUsersSuccessAction({ data: response }));
            }
        })
        .catch(error => {
            dispatch(getAllUsersFailureAction({ msg: error.message }));
        });
}

export async function setUserActiveStatus(activeStatus) {
    const loggedUserToken = getCookieValue(LOGGED_USER_TOKEN_COOKIE_NAME);
    if (!loggedUserToken) {
        return
    }

    const usersDbRef = firebase.app().database().ref('users/');
    usersDbRef
        .child(loggedUserToken)
        .update({
            "isActive": activeStatus,
            "lastActive": (new Date()).toString(),
        });
}

export async function getChatRoomDetails(chatRoomId) {
    let toReturn = { statusCode: 500, data: false, msg: "Selected chat does not exist" };

    const data = {};
    const chatRoomDbRef = firebase.app().database().ref('chatRooms/' + chatRoomId);
    await chatRoomDbRef
        .child("displayName")
        .once('value')
        .then(async resp => {
            const response = resp.val();
            if (response) {
                data.displayName = response;
            }
        })
        .catch(error => {
            toReturn.msg = error.message;
        });

    await chatRoomDbRef
        .child("members")
        .once('value')
        .then(async resp => {
            const response = resp.val();
            if (response) {
                data.members = response;
                toReturn.statusCode = 200;
                toReturn.data = data;
            }
        })
        .catch(error => {
            toReturn.msg = error.message;
        });

    return toReturn;
}

export async function getActiveStatusOfAUser(dispatch, userToken) {
    if (!userToken) {
        return;
    }

    const usersDbRef = firebase.app().database().ref('users/' + userToken + "/lastActive");
    usersDbRef
        .on('value',
            function(snap) {
                const response = snap.val();
                if (response) {
                    dispatch(getActiveStatusOfAUserSuccessAction({ data: response }));
                }
            });
}

export async function getMessagesOfAChatRoom(dispatch, chatRoomId) {
    if (!chatRoomId) {
        return;
    }

    dispatch(getMessagesOfAChatRoomAction({ chatRoomId }));

    const chatRoomDbRef = firebase.app().database().ref('chatRooms/' + chatRoomId + "/messages");
    chatRoomDbRef
        .on('child_added',
            resp => {
                const response = resp.val();
                if (response) {
                    dispatch(getMessagesOfAChatRoomSuccessAction({ data: { message: response, chatRoomId } }));
                }
            },
            error => {
            });
}