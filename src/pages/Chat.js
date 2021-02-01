import React, { useState, useEffect } from "react";
import { connect } from 'react-redux';
import { Redirect } from "react-router-dom";
import cx from "classnames";
import dayjs from 'dayjs';
import 'dayjs/locale/en';
import localizedFormat from 'dayjs/plugin/localizedFormat';

import userIcon from "../images/user.png";
import sendIcon from "../images/send2.png";
import uploadImgIcon from "../images/uploadImg.png";
import LandingPageDesign from "../components/LandingPageDesign";
import PurpleGradientContainer from "../components/PurpleGradientContainer";

import { CHAT_ACTION_BOX_HEIGHT, LOGGED_USER_TOKEN_COOKIE_NAME, MSG_TYPE_IMAGE } from "../constants";
import { getCookieValue } from "../utils";
import {
    checkLoginStatusAction,
    getChatRoomDetailsAction
} from "../redux/actions/index";
import {
    setUserActiveStatus,
    getActiveStatusOfAUser,
    removeGetActiveStatusOfAUserFirebaseQuery,
    getMessagesOfAChatRoom,
    removeGetMessagesOfAChatRoomFirebaseQuery,
} from "../firebaseQueries";

function Chat({
    isCheckingLoginStatus,
    isSomeoneLoggedIn,
    isGettingChatRoomDetails,
    isChatRoomDetailsFetched,
    activeStatusOfAUser,
    chatRoomDetails: {
        displayName,
        members = {},
    } = {},
    chatRoomMessages = {},
    match: {
        params: {
            chatRoomId,
        } = {}
    } = {},
    dispatch,
}) {
    isCheckingLoginStatus = false;
    isSomeoneLoggedIn = true;
    dayjs.locale('en');
    dayjs.extend(localizedFormat);

    const [displayNameUserActiveStatus, setDisplayNameUserActiveStatus] = useState("");
    const [msgText, setMsgText] = useState("");

    useEffect(() => {
        console.log("CHAT mounted")
        // dispatch(checkLoginStatusAction());
        dispatch(getChatRoomDetailsAction(chatRoomId));

        return () => {
            console.log("CHAT un-mounted")
            removeGetMessagesOfAChatRoomFirebaseQuery();
            removeGetActiveStatusOfAUserFirebaseQuery();
        }
    }, []);

    useEffect(() => {
        if (isChatRoomDetailsFetched && typeof members === "object") {
            getMessagesOfAChatRoom(dispatch, chatRoomId);

            //display last active of other user in case of one-0-one chat only
            if (Object.keys(members).length === 2) {
                try {
                    const loggedUserToken = getCookieValue(LOGGED_USER_TOKEN_COOKIE_NAME);
                    let displayNameUserToken = "";
                    for (const userToken in members) {
                        if (userToken !== loggedUserToken) {
                            displayNameUserToken = userToken;
                            break;
                        }
                    }
                    getActiveStatusOfAUser(dispatch, displayNameUserToken);
                } catch { }
            }
        }
    }, [isChatRoomDetailsFetched, members]);

    useEffect(() => {
        if (activeStatusOfAUser) {
            const currentTimeStamp = Date.parse(new Date()) / 1000; //in seconds
            const displayNameUserActiveStatusTimeStamp = Date.parse(activeStatusOfAUser) / 1000;
            console.log("diff", currentTimeStamp - displayNameUserActiveStatusTimeStamp);

            //displaying online in 60s bandwidth
            if ((currentTimeStamp - displayNameUserActiveStatusTimeStamp) <= 60) {
                setDisplayNameUserActiveStatus("online");
            } else {
                const formattedTime = dayjs(activeStatusOfAUser).format("lll");
                setDisplayNameUserActiveStatus(formattedTime);
            }
        }
    }, [activeStatusOfAUser]);

    // useEffect(() => {
    //     setUserActiveStatus(true);

    //     const setActiveStatusInterval = setInterval(function() {
    //         setUserActiveStatus(true);
    //     }, 10000); //setting user lastActive time every 10 seconds
    //     //other users need to compare their local time with that user lastActiveTime to get his active status

    //     return () => {
    //         clearInterval(setActiveStatusInterval);
    //     }
    // }, []);

    function renderMessages() {
        const loggedUserToken = getCookieValue(LOGGED_USER_TOKEN_COOKIE_NAME);

        const messagesOfThisChatRoom = chatRoomMessages[chatRoomId] || [];
        const toRender = messagesOfThisChatRoom.map(function(msg, index) {
            if (typeof msg !== "object") {
                return;
            }

            const time = msg.time;
            const type = msg.type;
            const formattedTime = dayjs(time).format("LT");

            if (type === MSG_TYPE_IMAGE) {

            } else {
                return (
                    <div key={msg.messageId + index} className={"messageContainer"} >
                        <div
                            className={cx(
                                "message",
                                { ["myMessageAlignment"]: msg.sentByUserToken === loggedUserToken }
                            )}
                        >
                            <div
                                className={cx(
                                    { ["myMessage"]: msg.sentByUserToken === loggedUserToken },
                                    { ["theirMessage"]: msg.sentByUserToken !== loggedUserToken }
                                )}
                                title={formattedTime}
                            >
                                {msg.message}
                            </div>
                        </div>
                        <div className="messageTime">{formattedTime}</div>
                    </div>
                )
            }
        });

        return toRender;
    }

    function redirectToHomeOrLoginPage() {
        if (!isCheckingLoginStatus) {
            if (!isSomeoneLoggedIn) {
                return <Redirect to="/login" />;
            }
        }
    }

    return (
        <>
            {redirectToHomeOrLoginPage()}

            {
                isCheckingLoginStatus || (isGettingChatRoomDetails || !isChatRoomDetailsFetched) ?
                    <LandingPageDesign isCheckingLoginStatus={isCheckingLoginStatus || isGettingChatRoomDetails} />
                    :
                    <PurpleGradientContainer childrenClassName="homeContainer">
                        <div
                            className="chatWindow"
                            style={{ "--actionBoxHeight": CHAT_ACTION_BOX_HEIGHT }}
                        >
                            <div className="chatTitle">
                                <img alt="userIcon" src={userIcon} />
                                <div>
                                    <div className="lightTitle">{displayName}</div>
                                    <div className="onlineStatus">{displayNameUserActiveStatus}</div>
                                </div>
                            </div>

                            <div className="chatContent">{renderMessages()}</div>
                        </div>

                        <div
                            className="chatActionBox"
                            style={{ "--actionBoxHeight": CHAT_ACTION_BOX_HEIGHT }}
                        >
                            <img alt="uploadImgIcon" src={uploadImgIcon} />
                            <input
                                type="text"
                                className="sendMsgTextInput"
                                placeholder="type message"
                                autoFocus
                                value={msgText}
                                onChange={(e) => setMsgText(e.target.value)}
                            />
                            <img alt="sendIcon" src={sendIcon} />
                        </div>
                    </PurpleGradientContainer>
            }
        </>
    );
}

const mapStateToProps = (state) => {
    return {
        isCheckingLoginStatus: state.isCheckingLoginStatus,
        isSomeoneLoggedIn: state.isSomeoneLoggedIn,
        isGettingChatRoomDetails: state.isGettingChatRoomDetails,
        isChatRoomDetailsFetched: state.isChatRoomDetailsFetched,
        activeStatusOfAUser: state.activeStatusOfAUser,
        chatRoomDetails: state.chatRoomDetails,
        chatRoomMessages: state.chatRoomMessages,
    }
}

export default connect(mapStateToProps, undefined)(Chat);