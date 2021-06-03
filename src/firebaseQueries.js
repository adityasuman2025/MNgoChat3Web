import firebase from './FirebaseConfig';
import dayjs from "./dayjs";
import { PAGINATION_MESSAGE_COUNT } from "./constants";
import { getLoggedUserToken, isEmpty } from "./utils";
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
    getANewMessageOfAChatRoomSuccessAction,

    getPaginatedMessagesAction,
    getPaginatedMessagesSuccessAction,

    getTypeStatusOfAUserSuccessAction,

    getUnreadMsgCountOfTheSecondUserAction,
    getUnreadMsgCountOfTheSecondUserSuccessAction,

    startANewChatRoomAction,
    startANewChatRoomSuccessAction,
    startANewChatRoomFailureAction,
} from "./redux/actions/index";

export async function doFirebaseAuth() {
    let toReturn = { statusCode: 500, data: false, msg: "" };

    try {
        const auth = await firebase.auth().signInAnonymously();
        if (auth) {
            if (auth.user.uid) {
                toReturn.statusCode = await 200;
                toReturn.data = await auth.user.uid;
            }
        }
    } catch {
        toReturn.msg = "Firebase Authentication failed";
    }

    return toReturn;
}

export async function checkUserExistsInFirebase(loggedUserToken) {
    let toReturn = { statusCode: 500, data: false, msg: "" };

    const usersDbRef = firebase.app().database().ref('users/' + loggedUserToken + "/userToken");
    await usersDbRef
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
            "lastActive": dayjs().format(),
            "addedOn": dayjs().format(),
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
    const loggedUserToken = getLoggedUserToken();
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
                } else {
                    dispatch(getUserAllChatsFailureAction({ msg: "" }));
                }
            },
            error => {
                dispatch(getUserAllChatsFailureAction({ msg: error.message }));
            });
}

export async function removeGetUserChatRoomsFirebaseQuery() {
    const loggedUserToken = getLoggedUserToken();
    if (!loggedUserToken) {
        return
    }

    const usersDbRef = firebase.app().database().ref('users/' + loggedUserToken + "/userChatRooms");
    usersDbRef.off();
}

export async function getAllUsers(dispatch) {
    const loggedUserToken = getLoggedUserToken();
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
            } else {
                dispatch(getAllUsersFailureAction({ msg: "" }));
            }
        })
        .catch(error => {
            dispatch(getAllUsersFailureAction({ msg: error.message }));
        });
}

export async function setUserActiveStatus() {
    const loggedUserToken = getLoggedUserToken();
    if (!loggedUserToken) {
        return
    }

    const usersDbRef = firebase.app().database().ref('users/');
    usersDbRef
        .child(loggedUserToken)
        .update({
            "lastActive": dayjs().format(), //iso format
        });
}

export async function getActiveStatusOfAUser(dispatch, userToken) {
    if (!userToken) {
        return;
    }

    const activeStatusDbRef = firebase.app().database().ref('users/' + userToken + "/lastActive");
    activeStatusDbRef
        .once('value')
        .then(async resp => {
            const response = resp.val();
            if (response) {
                dispatch(getActiveStatusOfAUserSuccessAction({ data: response }));
            }
        })
        .catch(error => { });
}

export async function getMessagesOfAChatRoom(dispatch, chatRoomId) {
    const loggedUserToken = getLoggedUserToken();
    if (!chatRoomId || !loggedUserToken) {
        return;
    }

    dispatch(getMessagesOfAChatRoomAction({ chatRoomId }));

    const chatRoomMessagesDbRef = firebase.app().database().ref('chatRooms/' + chatRoomId + "/messages");
    chatRoomMessagesDbRef.off();
    chatRoomMessagesDbRef
        .orderByChild('messageId')
        .limitToLast(PAGINATION_MESSAGE_COUNT)
        .once('value')
        .then(resp => {
            let isFirstFetch = true;
            const chatMessages = resp.val();
            const messages = [];
            if (chatMessages) {
                for (const messageId in chatMessages) {
                    const messageItem = chatMessages[messageId];
                    messages.push(messageItem);
                }
            }
            dispatch(getMessagesOfAChatRoomSuccessAction({ data: messages }));

            if (isEmpty(chatMessages)) {
                isFirstFetch = false;
            }

            chatRoomMessagesDbRef
                .endAt()
                .limitToLast(1)
                .on('child_added',
                    resp => {
                        if (isFirstFetch) {
                            isFirstFetch = false;
                        } else {
                            const chatMessages = resp.val();
                            dispatch(getANewMessageOfAChatRoomSuccessAction({ data: chatMessages, isANewMessage: true }));
                        }
                    },
                    error => { });
        })
        .catch(error => { });
}

export async function getPaginatedMessages(dispatch, chatRoomId, messageIdOfTheFirstMessageInList) {
    const loggedUserToken = getLoggedUserToken();
    if (!chatRoomId || !loggedUserToken || !messageIdOfTheFirstMessageInList) {
        return;
    }

    dispatch(getPaginatedMessagesAction());

    const chatRoomMessagesDbRef = firebase.app().database().ref('chatRooms/' + chatRoomId + "/messages");
    chatRoomMessagesDbRef
        .orderByChild('messageId')
        .endAt(messageIdOfTheFirstMessageInList)
        .limitToLast(PAGINATION_MESSAGE_COUNT)
        .once('value')
        .then(resp => {
            const chatMessages = resp.val();
            if (chatMessages) {
                const messages = [];
                for (const messageId in chatMessages) {
                    if (messageId === messageIdOfTheFirstMessageInList) continue;

                    const messageItem = chatMessages[messageId];
                    messages.push(messageItem);
                }
                dispatch(getPaginatedMessagesSuccessAction({ data: messages }));
            }
        })
        .catch(error => { });
}

export async function removeGetMessagesOfAChatRoomFirebaseQuery(chatRoomId) {
    if (!chatRoomId) {
        return;
    }

    const chatRoomMessagesDbRef = firebase.app().database().ref('chatRooms/' + chatRoomId + "/messages");
    chatRoomMessagesDbRef.off();
}

export async function sendMessageInAChatRoom(chatRoomId, message, type, secondUserToken, originalMessage) {
    const sentByUserToken = getLoggedUserToken();;
    if (!chatRoomId || !sentByUserToken || !type || !secondUserToken || !message) {
        return;
    }

    const timeStamp = Math.floor(Date.now());
    const messageId = timeStamp + "_by_" + sentByUserToken.substring(0, 3);
    const toSet = {
        messageId,
        message,
        sentByUserToken,
        type,
        time: dayjs().format(),
    };
    if (originalMessage) {
        toSet.originalMessageId = originalMessage.messageId;
        toSet.originalMessage = originalMessage.message;
        toSet.originalMessageType = originalMessage.type;
    }

    const chatRoomMsgDbRef = firebase.app().database().ref('chatRooms/' + chatRoomId + "/messages/" + messageId);
    await chatRoomMsgDbRef.set(toSet);

    const userChatRoomRef = firebase.app().database().ref('users/' + secondUserToken + "/userChatRooms/" + chatRoomId);
    userChatRoomRef
        .child("unSeenMsgCount")
        .set(firebase.database.ServerValue.increment(1))
        .catch(error => { })
}

export async function getUnreadMsgCountOfTheSecondUser(dispatch, chatRoomId, secondUserToken) {
    const loggedUserToken = getLoggedUserToken();
    if (!loggedUserToken || !chatRoomId || !secondUserToken) {
        return;
    }

    dispatch(getUnreadMsgCountOfTheSecondUserAction());
    const sencondUserChatRoomRef = firebase.app().database().ref('users/' + secondUserToken + "/userChatRooms/" + chatRoomId);
    sencondUserChatRoomRef
        .child("unSeenMsgCount")
        .on('value',
            resp => {
                const response = resp.val();
                dispatch(getUnreadMsgCountOfTheSecondUserSuccessAction({ data: response }));
            },
            error => { });
}

export async function removeGetUnreadMsgCountOfTheSecondUserFirebaseQuery(chatRoomId, secondUserToken) {
    if (!chatRoomId || !secondUserToken) {
        return;
    }

    const sencondUserChatRoomRef = firebase.app().database().ref('users/' + secondUserToken + "/userChatRooms/" + chatRoomId);
    sencondUserChatRoomRef.off();
}

export async function readingNewMessagesOfTheLoggedUserForThatChatRoom(chatRoomId) {
    const loggedUserToken = getLoggedUserToken();
    if (!loggedUserToken || !chatRoomId) {
        return;
    }

    const userChatRoomRef = firebase.app().database().ref('users/' + loggedUserToken + "/userChatRooms/" + chatRoomId);
    userChatRoomRef
        .child("unSeenMsgCount")
        .set(0)
        .catch(error => { })
}

export async function setUserTypeStatus(chatRoomId) {
    const loggedUserToken = getLoggedUserToken();
    if (!loggedUserToken || !chatRoomId) {
        return;
    }

    const userChatRoomRef = firebase.app().database().ref('chatRooms/' + chatRoomId + "/members/" + loggedUserToken);
    userChatRoomRef
        .child("lastTyped")
        .set(dayjs().format())
        .catch(error => { })
}

export async function getTypeStatusOfAUser(dispatch, chatRoomId, secondUserToken) {
    if (!secondUserToken || !chatRoomId) {
        return;
    }

    const userChatRoomLastTypeRef = firebase.app().database().ref('chatRooms/' + chatRoomId + "/members/" + secondUserToken);
    userChatRoomLastTypeRef
        .child("lastTyped")
        .once('value')
        .then(async resp => {
            const response = resp.val();
            if (response) {
                dispatch(getTypeStatusOfAUserSuccessAction({ data: response }));
            }
        })
        .catch(error => { });
}

export async function startANewChatRoom(params) {
    const loggedUserToken = getLoggedUserToken();
    const { dispatch, loggedUsername, secondUserToken, secondUsername } = params;
    if (!loggedUserToken || !loggedUsername || !secondUserToken || !secondUsername) {
        return;
    }

    dispatch(startANewChatRoomAction());
    const timeStamp = Math.floor(Date.now());
    const chatRoomId = timeStamp + "_" + loggedUserToken.substring(0, 3) + "_" + secondUserToken.substring(0, 3);

    const createChatRoomDbRef = firebase.app().database().ref('chatRooms/' + chatRoomId);
    await createChatRoomDbRef
        .set({
            chatRoomId,
            members: {
                [loggedUserToken]: { name: loggedUsername },
                [secondUserToken]: { name: secondUsername },
            },
            addedOn: dayjs().format(),
        })
        .catch(error => {
            dispatch(startANewChatRoomFailureAction({ msg: error.message }));
            return;
        });

    const loggedUserChatRoomsDbRef = firebase.app().database().ref('users/' + loggedUserToken + "/userChatRooms/" + chatRoomId);
    await loggedUserChatRoomsDbRef
        .set({
            chatRoomId,
            displayName: secondUsername,
            secondUserToken,
            unSeenMsgCount: 0,
        })
        .catch(error => {
            dispatch(startANewChatRoomFailureAction({ msg: error.message }));
            return;
        });

    const secondUserChatRoomsDbRef = firebase.app().database().ref('users/' + secondUserToken + "/userChatRooms/" + chatRoomId);
    await secondUserChatRoomsDbRef
        .set({
            chatRoomId,
            displayName: loggedUsername,
            secondUserToken: loggedUserToken,
            unSeenMsgCount: 0,
        })
        .catch(error => {
            dispatch(startANewChatRoomFailureAction({ msg: error.message }));
            return;
        });

    dispatch(startANewChatRoomSuccessAction({ data: { chatRoomId } }));
}

export async function setProfileImageOfAUser(profileImageUrl) {
    const loggedUserToken = getLoggedUserToken();
    if (!loggedUserToken || !profileImageUrl) return;

    const userRef = firebase.app().database().ref('users/' + loggedUserToken + "/profileImg");
    await userRef
        .set(profileImageUrl)
        .catch(error => { });
}