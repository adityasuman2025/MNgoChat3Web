import firebase from 'firebase/app';
import 'firebase/database';
// import 'firebase/auth';
import { usersRef, chatRoomsRef } from './FirebaseConfig';
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

    setActiveUsersListAction,
    getLastSeenOfAUserAction,

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

const userListRef = firebase.database().ref("usersOnline")
const myUserRef = userListRef.push()

export async function doFirebaseAuth(dispatch, userName) {
    firebase
        .database()
        .ref(".info/connected")
        .on("value", function(snap) {
            if (snap.val()) {
                // if we lose network then remove this user from the list
                myUserRef.onDisconnect().remove()
                // set user's online status
                let presenceObject = { userName }
                myUserRef.set(presenceObject)
            } else {
                // client has lost network
            }
        });

    userListRef.on("value", function(snap) {
        const activeUsers = snap.val();
        if (activeUsers) {
            const activeUsersList = [];
            Object.keys(activeUsers).forEach(function(id) {
                if (activeUsers[id].userName) {
                    activeUsersList.push(activeUsers[id].userName);
                }
            })
            dispatch(setActiveUsersListAction({ activeUsersList }));
        }
    })

    let toReturn = { statusCode: 200, data: false, msg: "" };

    // try {
    //     const auth = await firebase.auth().signInAnonymously();
    //     if (auth) {
    //         if (auth.user.uid) {
    //             toReturn.statusCode = await 200;
    //             toReturn.data = await auth.user.uid;
    //         }
    //     }
    // } catch {
    //     toReturn.msg = "Firebase Authentication failed";
    // }

    // const userListRef = firebase.database().ref("usersOnline")
    // const myUserRef = userListRef.push()

    return toReturn;
}

export async function checkUserExistsInFirebase(loggedUserToken) {
    let toReturn = { statusCode: 500, data: false, msg: "" };

    await usersRef
        .child(loggedUserToken + "/userToken")
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

    await usersRef
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

    usersRef
        .child(loggedUserToken + "/userChatRooms")
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

    usersRef
        .child(loggedUserToken + "/userChatRooms")
        .off();
}

export async function getAllUsers(dispatch) {
    const loggedUserToken = getLoggedUserToken();
    if (!loggedUserToken) {
        return
    }

    dispatch(getAllUsersAction());

    usersRef
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

export async function setLastSeenOfLoggedUser() {
    const loggedUserToken = getLoggedUserToken();
    if (!loggedUserToken) {
        return
    }

    usersRef
        .child(loggedUserToken)
        .update({
            "lastActive": dayjs().format(), //iso format
        });

    setInterval(function() {
        usersRef
            .child(loggedUserToken)
            .update({
                "lastActive": dayjs().format(), //iso format
            });
    }, 30 * 1000); //30 seconds
}

export async function getLastSeenOfAUser(dispatch, userToken) {
    usersRef
        .child(userToken + "/lastActive")
        .once('value')
        .then(async resp => {
            const response = resp.val();
            if (response) {
                dispatch(getLastSeenOfAUserAction({ data: response }));
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

    const chatRoomMessagesDbRef = chatRoomsRef.child(chatRoomId + "/messages");
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

    chatRoomsRef
        .child(chatRoomId + "/messages")
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

    chatRoomsRef
        .child(chatRoomId + "/messages")
        .off();
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

    chatRoomsRef
        .child(chatRoomId + "/messages/" + messageId)
        .set(toSet);

    usersRef
        .child(secondUserToken + "/userChatRooms/" + chatRoomId)
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

    usersRef
        .child(secondUserToken + "/userChatRooms/" + chatRoomId)
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

    usersRef
        .child(secondUserToken + "/userChatRooms/" + chatRoomId)
        .child("unSeenMsgCount")
        .off();
}

export async function readingNewMessagesOfTheLoggedUserForThatChatRoom(chatRoomId) {
    const loggedUserToken = getLoggedUserToken();
    if (!loggedUserToken || !chatRoomId) {
        return;
    }

    usersRef
        .child(loggedUserToken + "/userChatRooms/" + chatRoomId)
        .child("unSeenMsgCount")
        .set(0)
        .catch(error => { })
}

export async function setUserTypeStatus(chatRoomId) {
    const loggedUserToken = getLoggedUserToken();
    if (!loggedUserToken || !chatRoomId) {
        return;
    }

    chatRoomsRef
        .child(chatRoomId + "/members/" + loggedUserToken)
        .child("lastTyped")
        .set(dayjs().format())
        .catch(error => { })
}

export async function resetUserTypeStatus(chatRoomId) {
    const loggedUserToken = getLoggedUserToken();
    if (!loggedUserToken || !chatRoomId) {
        return;
    }

    chatRoomsRef
        .child(chatRoomId + "/members/" + loggedUserToken)
        .child("lastTyped")
        .set(null)
        .catch(error => { })
}

export async function getTypeStatusOfAUser(dispatch, chatRoomId, secondUserToken) {
    if (!secondUserToken || !chatRoomId) {
        return;
    }

    chatRoomsRef
        .child(chatRoomId + "/members/" + secondUserToken)
        .child("lastTyped")
        .on("value", function(snap) {
            const response = snap.val();
            dispatch(getTypeStatusOfAUserSuccessAction({ data: response }));
        });
}

export async function removeGetTypeStatusOfAUserFirebaseQuery(chatRoomId, secondUserToken) {
    if (!secondUserToken || !chatRoomId) {
        return;
    }

    chatRoomsRef
        .child(chatRoomId + "/members/" + secondUserToken)
        .child("lastTyped")
        .off();
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

    await chatRoomsRef
        .child(chatRoomId)
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

    await usersRef
        .child(loggedUserToken + "/userChatRooms/" + chatRoomId)
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

    await usersRef
        .child(secondUserToken + "/userChatRooms/" + chatRoomId)
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

    await usersRef
        .child(loggedUserToken + "/profileImg")
        .set(profileImageUrl)
        .catch(error => { });
}