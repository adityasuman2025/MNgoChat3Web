import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import cx from "classnames";

import userIcon from "../images/user.png";
import allChats from "../images/allChats.png";
import allUsersIcon from "../images/allUsers.png";
import LoadingAnimation from "./LoadingAnimation";

import {
    BOTTOM_NAV_HEIGHT,
    BOTTOM_NAV_BOTTOM_MARGIN,
} from "../constants";
import {
    setUserActiveStatus,
    getUserChatRooms,
    getAllUsers,
    removeGetUserChatRoomsFirebaseQuery,
} from "../firebaseQueries";

const CHATS_TITLE = "Chats";
const USERS_TITLE = "Users";

function HomePageContent({
    isGettingUserAllChats,
    isGettingAllUsers,
    allUsers = {},
    userAllChats = {},
    userDetails: {
        username: loggedUsername
    } = {},
    history,
    dispatch,
}) {
    const [title, setTitle] = useState(CHATS_TITLE);

    useEffect(() => {
        getUserChatRooms(dispatch);
        getAllUsers(dispatch);
        setUserActiveStatus(true);

        const setActiveStatusInterval = setInterval(function() {
            setUserActiveStatus(true);
        }, 10000); //setting user lastActive time every 10 seconds
        //other users need to compare their local time with that user lastActiveTime to get his active status

        return () => {
            removeGetUserChatRoomsFirebaseQuery();
            clearInterval(setActiveStatusInterval);
        }
    }, []);

    function hanldeNavBtnClick(type) {
        if (type === CHATS_TITLE) {
            setTitle(CHATS_TITLE)
        } else {
            setTitle(USERS_TITLE)
        }
    }

    function handleUserItemClick(data) {
        if (!data) return;

        if (title === CHATS_TITLE) {
            history.push("chat/" + data); //data = chatRoomId
        } else {
            const selectedUsername = data.username;
            const selectedUserToken = data.userToken;
            if (selectedUsername && selectedUserToken) {
                for (const chatRoomId in userAllChats) {
                    const userChatRoom = userAllChats[chatRoomId];
                    const secondUserToken = userChatRoom.secondUserToken;

                    //if that user is already present in all-chats of loggedUser
                    //then redirecting him to the chat page of that chatRoomId
                    if (selectedUserToken.trim() === secondUserToken.trim()) {
                        history.push("chat/" + chatRoomId);
                        return;
                    }
                }

                // if that user is not present in all-chats of loggedUser
                // then redirecting him to the new-chat page for that secondUserToken (other userToken)
                const selectedUserDetails = { name: selectedUsername, token: selectedUserToken };
                history.push("new-chat/" + JSON.stringify(selectedUserDetails));
            }
        }
    }

    function renderAllChats() {
        // unread msg chatRooms will be listed first
        const toRender = Object.keys(userAllChats).map(function(chatRoomId) {
            const userChat = userAllChats[chatRoomId];
            const unSeenMsgCount = parseInt(userChat.unSeenMsgCount) || 0;

            if (unSeenMsgCount === 0) return;
            return (
                <div
                    key={chatRoomId}
                    className={cx("listUserItem", { ["unSeenMsgUser"]: unSeenMsgCount > 0 })}
                    onClick={() => handleUserItemClick(chatRoomId, title)}
                >
                    <img alt="userIcon" src={userIcon} />
                    {userChat.displayName}
                </div>
            )
        });

        toRender.push(Object.keys(userAllChats).map(function(chatRoomId) {
            const userChat = userAllChats[chatRoomId];
            const unSeenMsgCount = parseInt(userChat.unSeenMsgCount) || 0;

            if (unSeenMsgCount !== 0) return;
            return (
                <div
                    key={chatRoomId}
                    className={cx("listUserItem", { ["unSeenMsgUser"]: unSeenMsgCount > 0 })}
                    onClick={() => handleUserItemClick(chatRoomId)}
                >
                    <img alt="userIcon" src={userIcon} />
                    {userChat.displayName}
                </div>
            )
        }));

        return toRender;
    }

    return (
        <div className="homeContainer">
            <div
                className="homeContentContainer"
                style={{
                    "--bottomNavHeight": BOTTOM_NAV_HEIGHT,
                    "--bottomNavMarginBottom": BOTTOM_NAV_BOTTOM_MARGIN,
                }}
            >
                <div className="homeTitle">
                    <div className="darkTitle">{title}</div>
                </div>
                <div className="homeContent">
                    {
                        isGettingUserAllChats || isGettingAllUsers ?
                            <LoadingAnimation dark loading />
                            :
                            <div>
                                {
                                    title === CHATS_TITLE ?
                                        renderAllChats()
                                        :
                                        Object.keys(allUsers).map(function(userToken) {
                                            const user = allUsers[userToken];
                                            const displayName = user.username;

                                            if (displayName !== loggedUsername) {
                                                return (
                                                    <div
                                                        key={userToken}
                                                        className="listUserItem"
                                                        onClick={() => handleUserItemClick(user)}
                                                    >
                                                        <img alt="userIcon" src={userIcon} />
                                                        {displayName}
                                                    </div>
                                                )
                                            }
                                        })
                                }
                            </div>
                    }
                </div>
            </div>

            <div
                className="homeBottomNavContainer"
                style={{
                    "--bottomNavHeight": BOTTOM_NAV_HEIGHT,
                    "--bottomNavMarginBottom": BOTTOM_NAV_BOTTOM_MARGIN,
                }}
            >
                <img
                    className={cx("bottomTabIcons", { ["selectedBottomTabIcon"]: title === CHATS_TITLE })}
                    alt="allChats"
                    src={allChats}
                    onClick={() => hanldeNavBtnClick(CHATS_TITLE)}
                />

                <img
                    className={cx("bottomTabIcons", { ["selectedBottomTabIcon"]: title === USERS_TITLE })}
                    alt="allUsers"
                    src={allUsersIcon}
                    onClick={() => hanldeNavBtnClick(USERS_TITLE)}
                />
            </div>
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        isGettingUserAllChats: state.isGettingUserAllChats,
        isGettingAllUsers: state.isGettingAllUsers,
        allUsers: state.allUsers,
        userAllChats: state.userAllChats,
        userDetails: state.userDetails,
    }
}

export default connect(mapStateToProps, undefined)(HomePageContent);