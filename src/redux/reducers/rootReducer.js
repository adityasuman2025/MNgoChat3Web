import userIcon from "../../images/user.png";

const initialState = {
    snackBarCount: 0,
    snackBarMsg: null,
    snackBarType: "error",

    isCheckingLoginStatus: true,
    isSomeoneLoggedIn: false,
    checkLoginStatusError: null,
    userDetails: {},

    isLoggingUser: false,
    loginUserError: null,

    isRegisteringUser: false,
    isUserRegistered: false,
    registerUserError: null,

    isVerifyingPasscode: false,
    isPasscodeVerified: false,
    verifyPasscodeError: null,

    isGettingUserAllChats: false,
    getUserAllChatsError: null,
    userAllChats: {},

    isGettingAllUsers: false,
    getAllUsersError: null,
    allUsers: {},
    userToProfileImgMapping: {},

    lastSeenOfAUser: null,
    activeUsersList: [],

    isGettingChatRoomMessages: false,
    isInitialMessagesFetched: false,
    isPaginatedMessagesFetched: false,
    isANewMessage: 0,
    chatRoomMessages: [],

    typeStatusOfAUser: null,

    unreadMsgCountOfTheSecondUser: 0,

    isStartingANewChatRoom: false,
    isANewChatRoomStarted: false,
    startNewChatRoomError: null,
    newChatRoomDetails: {},

    isUploadingImage: false,
    uploadImageError: null,

    secondUserProfileImage: userIcon,
}

const defaultState = initialState;

const rootReducer = (state = initialState, { type, payload = {} }) => {
    switch (type) {
        case 'RESET_REDUCER_STATE': {
            return defaultState;
        }

        case 'SHOW_SNACKBAR': {
            return {
                ...state,
                snackBarCount: state.snackBarCount + 1,
                snackBarMsg: payload.msg || null,
                snackBarType: payload.type || "error",
            }
        }

        case 'UPDATE_USER_TO_PROFILE_IMAGE_MAPPING': {
            const userToProfileImgMapping = state.userToProfileImgMapping;

            const username = payload.username;
            const newImageUrl = payload.newImageUrl;
            if (username && newImageUrl) {
                userToProfileImgMapping[username] = newImageUrl;
            }

            return {
                ...state,
                userToProfileImgMapping
            }
        }

        case 'RESET_DATA_OF_A_CHAT_ROOM': {
            return {
                ...state,
                lastSeenOfAUser: null,
                chatRoomMessages: [],
            }
        }

        case 'CHECK_LOGIN_STATUS': {
            return {
                ...state,
                isCheckingLoginStatus: true,
                isSomeoneLoggedIn: false,
                checkLoginStatusError: null,
                userDetails: {},
            }
        }
        case 'CHECK_LOGIN_STATUS_SUCCESS': {
            const userDetails = payload.userDetails;
            let isSomeoneLoggedIn = false;
            if (userDetails) {
                isSomeoneLoggedIn = true;
            }

            return {
                ...state,
                isCheckingLoginStatus: false,
                isSomeoneLoggedIn,
                userDetails: userDetails || {},
            }
        }
        case 'CHECK_LOGIN_STATUS_FAILURE': {
            return {
                ...state,
                isCheckingLoginStatus: false,
                checkLoginStatusError: payload.msg,
            }
        }

        case 'LOGIN_USER': {
            return {
                ...state,
                isLoggingUser: true,
                isSomeoneLoggedIn: false,
                loginUserError: null,
                userDetails: {},
            }
        }
        case 'LOGIN_USER_SUCCESS': {
            const userDetails = payload.userDetails;
            let isSomeoneLoggedIn = false;
            if (userDetails) {
                isSomeoneLoggedIn = true;
            }

            return {
                ...state,
                isLoggingUser: false,
                isSomeoneLoggedIn,
                userDetails: userDetails || {},
            }
        }
        case 'LOGIN_USER_FAILURE': {
            return {
                ...state,
                isLoggingUser: false,
                loginUserError: payload.msg,
            }
        }

        case 'REGISTER_USER': {
            return {
                ...state,
                isRegisteringUser: true,
                isUserRegistered: false,
                registerUserError: null,
            }
        }
        case 'REGISTER_USER_SUCCESS': {
            return {
                ...state,
                isRegisteringUser: false,
                isUserRegistered: true,
            }
        }
        case 'REGISTER_USER_FAILURE': {
            return {
                ...state,
                isRegisteringUser: false,
                registerUserError: payload.msg,
            }
        }

        case 'VERIFY_PASSCODE': {
            return {
                ...state,
                isVerifyingPasscode: true,
                isPasscodeVerified: false,
                verifyPasscodeError: null,
            }
        }
        case 'VERIFY_PASSCODE_SUCCESS': {
            return {
                ...state,
                isVerifyingPasscode: false,
                isPasscodeVerified: true,
            }
        }
        case 'VERIFY_PASSCODE_FAILURE': {
            return {
                ...state,
                isVerifyingPasscode: false,
                verifyPasscodeError: payload.msg,
            }
        }

        case 'GET_USER_ALL_CHATS': {
            return {
                ...state,
                isGettingUserAllChats: true,
                getUserAllChatsError: null,
                userAllChats: {},
            }
        }
        case 'GET_USER_ALL_CHATS_SUCCESS': {
            return {
                ...state,
                isGettingUserAllChats: false,
                userAllChats: payload.data || {},
            }
        }
        case 'GET_USER_ALL_CHATS_FAILURE': {
            return {
                ...state,
                isGettingUserAllChats: false,
                getUserAllChatsError: payload.msg,
            }
        }

        case 'GET_ALL_USERS': {
            return {
                ...state,
                isGettingAllUsers: true,
                getAllUsersError: null,
                allUsers: {},
            }
        }
        case 'GET_ALL_USERS_SUCCESS': {
            const allUsers = payload.data || {};

            const userToProfileImgMapping = {};
            Object.keys(allUsers).forEach(function(userToken) {
                const user = allUsers[userToken];
                const displayName = user.username;
                const profileImg = user.profileImg;

                userToProfileImgMapping[displayName] = profileImg;
            });
            return {
                ...state,
                isGettingAllUsers: false,
                allUsers,
                userToProfileImgMapping,
            }
        }
        case 'GET_ALL_USERS_FAILURE': {
            return {
                ...state,
                isGettingAllUsers: false,
                getAllUsersError: payload.msg,
            }
        }

        case 'GET_LAST_SEEN_OF_A_USER': {
            let lastSeenOfAUser = payload.data;
            return {
                ...state,
                lastSeenOfAUser,
            }
        }

        case 'SET_ACTIVE_USERS_LIST': {
            const activeUsersList = payload.activeUsersList || [];
            return {
                ...state,
                activeUsersList,
            }
        }

        case 'GET_MESSAGES_OF_A_CHAT_ROOM': {
            return {
                ...state,
                isGettingChatRoomMessages: true,
                isInitialMessagesFetched: false,
                isANewMessage: 0,
                chatRoomMessages: [],
            }
        }
        case 'GET_MESSAGES_OF_A_CHAT_ROOM_SUCCESS': {
            const messages = payload.data || [];
            return {
                ...state,
                isGettingChatRoomMessages: false,
                isInitialMessagesFetched: true,
                chatRoomMessages: messages,
            }
        }
        case 'GET_A_NEW_MESSAGE_OF_A_CHAT_ROOM_SUCCESS': {
            const messageItem = payload.data || {};
            return {
                ...state,
                isANewMessage: parseInt(state.isANewMessage) + 1,
                chatRoomMessages: [
                    ...state.chatRoomMessages,
                    messageItem,
                ],
            }
        }

        case 'GET_PAGINATED_MESSAGES': {
            return {
                ...state,
                isGettingChatRoomMessages: true,
                isPaginatedMessagesFetched: false,
            }
        }
        case 'GET_PAGINATED_MESSAGES_SUCCESS': {
            const messages = payload.data || [];

            return {
                ...state,
                isGettingChatRoomMessages: false,
                isPaginatedMessagesFetched: true,
                chatRoomMessages: [
                    ...messages,
                    ...state.chatRoomMessages,
                ],
            }
        }

        case 'GET_TYPE_STATUS_OF_A_USER_SUCCESS': {
            let typeStatusOfAUser = payload.data || null;
            if (typeStatusOfAUser) {
                const currentTimeStamp = Date.parse(new Date()) / 1000; //in seconds
                const displayNameUserActiveStatusTimeStamp = Date.parse(typeStatusOfAUser) / 1000;
                const timeDiff = currentTimeStamp - displayNameUserActiveStatusTimeStamp;

                //displaying online in 1s bandwidth
                if (timeDiff <= 1) {
                    typeStatusOfAUser = "typing...";
                } else {
                    typeStatusOfAUser = null;
                }
            }
            return {
                ...state,
                typeStatusOfAUser,
            }
        }

        case 'GET_UNREAD_MSG_COUNT_OF_THE_SECOND_USER': {
            return {
                ...state,
                unreadMsgCountOfTheSecondUser: 0,
            }
        }
        case 'GET_UNREAD_MSG_COUNT_OF_THE_SECOND_USER_SUCCESS': {
            let unreadMsgCountOfTheSecondUser = payload.data || 0;
            return {
                ...state,
                unreadMsgCountOfTheSecondUser,
            }
        }

        case 'START_A_NEW_CHAT_ROOM': {
            return {
                ...state,
                isStartingANewChatRoom: true,
                isANewChatRoomStarted: false,
                startNewChatRoomError: null,
                newChatRoomDetails: {},
            }
        }
        case 'START_A_NEW_CHAT_ROOM_SUCCESS': {
            return {
                ...state,
                isStartingANewChatRoom: false,
                isANewChatRoomStarted: true,
                newChatRoomDetails: payload.data || {},
            }
        }
        case 'START_A_NEW_CHAT_ROOM_FAILURE': {
            return {
                ...state,
                isStartingANewChatRoom: false,
                startNewChatRoomError: payload.msg,
            }
        }

        case 'UPLOAD_IMAGE_IN_FIREBASE': {
            return {
                ...state,
                isUploadingImage: true,
                uploadImageError: null,
            }
        }
        case 'UPLOAD_IMAGE_IN_FIREBASE_SUCCESS': {
            return {
                ...state,
                isUploadingImage: false,
            }
        }
        case 'UPLOAD_IMAGE_IN_FIREBASE_FAILURE': {
            return {
                ...state,
                isUploadingImage: true,
                uploadImageError: payload.msg,
            }
        }

        case 'GET_PROFILE_IMAGE_OF_A_USER': {
            return {
                ...state,
                secondUserProfileImage: userIcon,
            }
        }

        case 'GET_PROFILE_IMAGE_OF_A_USER_SUCCESS': {
            return {
                ...state,
                secondUserProfileImage: payload.data || userIcon,
            }
        }

        default: return state
    }
}

export default rootReducer;