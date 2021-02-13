import imageCompression from 'browser-image-compression';

import firebase from './FirebaseConfig';
import dayjs from "./dayjs";
import { PAGINATION_MESSAGE_COUNT, IMAGE_COMPRESSION_OPTIONS } from "./constants";
import { getLoggedUserToken, encryptText, decryptText, isEmpty } from "./utils";
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
    getMessagesOfAChatRoomAllSuccessAction,

    getPaginatedMessagesAction,
    getPaginatedMessagesSuccessAction,

    getTypeStatusOfAUserSuccessAction,

    startANewChatRoomAction,
    startANewChatRoomSuccessAction,
    startANewChatRoomFailureAction,

    uploadImageInFirebaseAction,
    uploadImageInFirebaseFailureAction,
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

export async function setUserActiveStatus(activeStatus) {
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

export async function getChatRoomDetails(chatRoomId) {
    let toReturn = { statusCode: 500, data: false, msg: "Selected chat does not exist" };

    const data = {};
    const chatRoomDbRef = firebase.app().database().ref('chatRooms/' + chatRoomId);
    await chatRoomDbRef
        .child("members")
        .once('value')
        .then(async resp => {
            const response = resp.val();
            if (response) {
                data.members = response;
                toReturn.statusCode = 200;
                toReturn.data = data;
                toReturn.msg = "";
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
            for (const id in chatMessages) {
                const message = chatMessages[id];
                dispatch(getMessagesOfAChatRoomSuccessAction({ data: message }));
            }
            if (isEmpty(chatMessages)) {
                isFirstFetch = false;
            }

            dispatch(getMessagesOfAChatRoomAllSuccessAction());
            chatRoomMessagesDbRef
                .endAt()
                .limitToLast(1)
                .on('child_added',
                    resp => {
                        if (isFirstFetch) {
                            isFirstFetch = false;
                        } else {
                            const chatMessages = resp.val();
                            dispatch(getMessagesOfAChatRoomSuccessAction({ data: chatMessages, isANewMessage: true }));
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
                    const message = messageItem.message;
                    messageItem.message = decryptText(message);

                    const originalMessage = messageItem.originalMessage;
                    if (originalMessage) {
                        messageItem.originalMessage = decryptText(originalMessage);
                    }

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
    const encryptedMsg = encryptText(message);
    if (!chatRoomId || !sentByUserToken || !type || !secondUserToken || !encryptedMsg) {
        return;
    }

    const timeStamp = Math.floor(Date.now());
    const messageId = timeStamp + "_by_" + sentByUserToken.substring(0, 5);
    const toSet = {
        messageId,
        message: encryptedMsg,
        sentByUserToken,
        type,
        time: dayjs().format("HH:mm:ssZ"),
    };
    if (originalMessage) {
        const encryptedOrgMessage = encryptText(originalMessage.message);
        toSet.originalMessageId = originalMessage.messageId;
        toSet.originalMessage = encryptedOrgMessage;
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

export async function uploadImageInFirebase(dispatch, imageFile) {
    const loggedUserToken = getLoggedUserToken();
    if (!loggedUserToken || !imageFile) return;

    try {
        dispatch(uploadImageInFirebaseAction());

        const compressedImg = await imageCompression(imageFile, IMAGE_COMPRESSION_OPTIONS);
        if (!compressedImg) return;

        const timeStamp = Math.floor(Date.now());
        const imageName = timeStamp + "_" + loggedUserToken.substring(0, 3) + ".png";

        //putting image in firebase
        const storageRef = firebase.app().storage().ref().child("image/" + imageName);
        await storageRef.put(compressedImg);
        return storageRef;
    } catch {
        dispatch(uploadImageInFirebaseFailureAction({ msg: "Fail to upload image" }));
    }
}
