import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import cx from "classnames";

import userIcon from "../images/user.png";
import allChats from "../images/allChats.png";
import allUsersIcon from "../images/allUsers.png";
import ProfileIcon from "../images/profile.png";
import EditIcon from "../images/edit.png";
import logoutIcon from "../images/logout.png";
import LoadingAnimation from "./LoadingAnimation";
import ActionButton from "./ActionButton";

import { BOTTOM_NAV_HEIGHT, BOTTOM_NAV_BOTTOM_MARGIN } from "../constants";
import { logout } from "../utils";
import {
    setUserActiveStatus,
    getUserChatRooms,
    getAllUsers,
    removeGetUserChatRoomsFirebaseQuery,
} from "../firebaseQueries";

const CHATS_TITLE = "Chats";
const USERS_TITLE = "Users";
const PROFILE_TITLE = "Profile";

function HomePageContent({
    isGettingUserAllChats,
    isGettingAllUsers,
    allUsers = {},
    userAllChats = {},
    userDetails,
    userDetails: {
        username: loggedUsername,
        name,
        email,
    } = {},
    history,
    dispatch,
}) {
    console.log("userDetails", userDetails);
    const imageInputRef = useRef();
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
            setTitle(CHATS_TITLE);
        } else if (type === USERS_TITLE) {
            setTitle(USERS_TITLE);
        } else if (type === PROFILE_TITLE) {
            setTitle(PROFILE_TITLE);
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
                try {
                    for (const chatRoomId in userAllChats) {
                        const userChatRoom = userAllChats[chatRoomId];
                        const secondUserToken = userChatRoom.secondUserToken;

                        //if that user is already present in all-chats of loggedUser
                        //then redirecting him to the chat page of that chatRoomId
                        if (selectedUserToken === secondUserToken) {
                            history.push("chat/" + chatRoomId);
                            return;
                        }
                    }

                    // if that user is not present in all-chats of loggedUser
                    // then redirecting him to the new-chat page for that secondUserToken (other userToken)
                    const selectedUserDetails = { name: selectedUsername, token: selectedUserToken };
                    history.push("new-chat/" + JSON.stringify(selectedUserDetails));
                } catch { }
            }
        }
    }

    async function handleLogoutBtnClick() {
        await logout(dispatch);
        window.location.reload();
    }

    function handleEditIconClick() {
        imageInputRef.current && imageInputRef.current.click();
    }

    function renderAllChats() {
        // unread msg chatRooms will be listed first
        const toRender = Object.keys(userAllChats).map(function(chatRoomId) {
            const userChat = userAllChats[chatRoomId];
            const unSeenMsgCount = parseInt(userChat.unSeenMsgCount) || 0;
            const displayName = userChat.displayName;

            if (unSeenMsgCount === 0) return;
            if (!displayName) return;
            return (
                <div
                    key={chatRoomId}
                    className={cx("listUserItem", { ["unSeenMsgUser"]: unSeenMsgCount > 0 })}
                    onClick={() => handleUserItemClick(chatRoomId, title)}
                >
                    <img alt="userIcon" src={userIcon} />
                    {displayName}
                </div>
            )
        });

        toRender.push(Object.keys(userAllChats).map(function(chatRoomId) {
            const userChat = userAllChats[chatRoomId];
            const unSeenMsgCount = parseInt(userChat.unSeenMsgCount) || 0;
            const displayName = userChat.displayName;

            if (unSeenMsgCount !== 0) return;
            if (!displayName) return;
            return (
                <div
                    key={chatRoomId}
                    className={cx("listUserItem", { ["unSeenMsgUser"]: unSeenMsgCount > 0 })}
                    onClick={() => handleUserItemClick(chatRoomId)}
                >
                    <img alt="userIcon" src={userIcon} />
                    {displayName}
                </div>
            )
        }));

        return toRender;
    }

    function renderTabContent() {
        switch (title) {
            case CHATS_TITLE:
                return renderAllChats();
                break;
            case USERS_TITLE:
                return Object.keys(allUsers).map(function(userToken) {
                    const user = allUsers[userToken];
                    const displayName = user.username;

                    if (!displayName) return;
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
                });
                break;
            case PROFILE_TITLE:
                return (
                    <div className="profileContainer">
                        <div className="userProfileImgBox">
                            <input
                                ref={imageInputRef}
                                style={{ display: "none" }}
                                type="file"
                                name="myImage"
                                // onChange={handleSelectImage}
                                accept="image/*"
                            />
                            <img
                                alt="userProfileImg"
                                className="userProfileImg"
                                src={ProfileIcon}
                            />
                            <img
                                alt="editIcon"
                                className="editProfileIcon"
                                src={EditIcon}
                                onClick={handleEditIconClick}
                            />
                        </div>
                        <div className="loggedUserName">{loggedUsername}</div>
                        {/* <ActionButton
                            dark
                            className="uploadBtn"
                            buttonText="Upload"
                        /> */}

                        <div className="userDetailsContainer">
                            {
                                name ?
                                    <div className="userDetailsText">
                                        <span className="userDetailsTitle">Name: </span>
                                        <span>{name}</span>
                                    </div>
                                    : null
                            }
                            {
                                email ?
                                    <div className="userDetailsText">
                                        <span className="userDetailsTitle">Email: </span>
                                        <span>{email}</span>
                                    </div>
                                    : null
                            }
                        </div>
                        <div className="divider" />

                        <div className="appDetailsContainer">
                            <div className="userDetailsText">
                                <span className="userDetailsTitle">version: </span>
                                <span>3.0</span>
                            </div>
                            <div className="userDetailsText">
                                <span className="userDetailsTitle">release date: </span>
                                <span>15 January 2021</span>
                            </div>
                            <div className="userDetailsText">
                                <span className="userDetailsTitle">latest release: </span>
                                <span>1 March 2021</span>
                            </div>
                            <div className="userDetailsText">
                                <span className="userDetailsTitle">first release: </span>
                                <span>16 July 2018</span>
                            </div>
                            <div className="userDetailsText">
                                <span className="userDetailsTitle">developer: </span>
                                <span>Aditya Suman</span>
                            </div>
                            <div className="userDetailsText">
                                <span className="userDetailsTitle">contact: </span>
                                <span>aditya@mngo.in</span>
                            </div>
                            <div className="userDetailsText">
                                <span className="userDetailsTitle">technologies used: </span>
                                <span>React.js, Redux, Firebase</span>
                            </div>
                        </div>
                        <div className="divider" />

                        <div className="appDetailsContainer">© 2018-21 This property belongs to Aditya Suman</div>
                    </div>
                )
                break;
            default:
            // code block
        }
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
                    <img alt="logoutIcon" src={logoutIcon} onClick={handleLogoutBtnClick} />
                </div>
                <div className="homeContent">
                    {
                        isGettingUserAllChats || isGettingAllUsers ?
                            <LoadingAnimation dark loading />
                            :
                            <div>{renderTabContent()}</div>
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

                <img
                    className={cx("bottomTabIcons", { ["selectedBottomTabIcon"]: title === PROFILE_TITLE })}
                    alt="profile"
                    src={ProfileIcon}
                    onClick={() => hanldeNavBtnClick(PROFILE_TITLE)}
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