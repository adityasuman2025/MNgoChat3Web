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
    dispatch,
}) {
    const [title, setTitle] = useState(CHATS_TITLE);

    useEffect(() => {
        getUserChatRooms(dispatch);
        getAllUsers(dispatch);
    }, []);

    useEffect(() => {
        setUserActiveStatus(true);

        setInterval(function() {
            setUserActiveStatus(true);
        }, 10000); //setting user lastActive time every 10 seconds
        //other users need to compare their local time with that user lastActiveTime to get his active status
    }, []);

    function hanldeNavBtnClick(type) {
        if (type === CHATS_TITLE) {
            setTitle(CHATS_TITLE)
        } else {
            setTitle(USERS_TITLE)
        }
    }

    function handleUserItemClick() {
        console.log(title)
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
                                        Object.keys(userAllChats).map(function(key) {
                                            const user = userAllChats[key];
                                            const unSeenMsgCount = user.unSeenMsgCount || 0;
                                            const isUnSeen = (unSeenMsgCount > 0);

                                            return (
                                                <div
                                                    key={key}
                                                    className={cx("listUserItem", { ["unSeenMsgUser"]: isUnSeen })}
                                                    onClick={handleUserItemClick}
                                                >
                                                    <img alt="userIcon" src={userIcon} />
                                                    {user.displayName}
                                                </div>
                                            )
                                        })
                                        :
                                        Object.keys(allUsers).map(function(userToken) {
                                            const user = allUsers[userToken];
                                            const displayName = user.username;

                                            if (displayName !== loggedUsername) {
                                                return (
                                                    <div
                                                        key={userToken}
                                                        className="listUserItem"
                                                        onClick={handleUserItemClick}
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