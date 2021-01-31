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

    const usersDbRef = firebase.app().database().ref('users/');
    usersDbRef
        .child(loggedUserToken)
        .on('value',
            function(snap) {
                const response = snap.val();
                if (response) {
                    const data = response.userChatRooms;

                    dispatch(getUserAllChatsSuccessAction({ data }));
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
        .on('value',
            function(snap) {
                const response = snap.val();
                if (response) {
                    dispatch(getAllUsersSuccessAction({ data: response }));
                }
            },
            error => {
                dispatch(getAllUsersFailureAction({ msg: error.message }));
            });
}