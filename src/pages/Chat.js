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
import LoadingAnimation from "../components/LoadingAnimation";

import { CHAT_ACTION_BOX_HEIGHT, MSG_TYPE_IMAGE } from "../constants";
import { getLoggedUserToken, getUserTokenOfTheDisplayNameUser, scrollADivToBottom } from "../utils";
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
    sendMessageInAChatRoom,
} from "../firebaseQueries";

function Chat({
    isCheckingLoginStatus,
    isSomeoneLoggedIn,
    isGettingChatRoomDetails,
    isChatRoomDetailsFetched,
    isGettingChatRoomMessages,
    activeStatusOfAUser,
    chatRoomDetails: {
        displayName,
        members = {},
    } = {},
    chatRoomMessages = [],
    match: {
        params: {
            chatRoomId,
        } = {}
    } = {},
    dispatch,
}) {
    dayjs.locale('en');
    dayjs.extend(localizedFormat);

    const [msgText, setMsgText] = useState("");

    useEffect(() => {
        window.addEventListener('offline', function(e) {
            console.log('offline');
        });

        window.addEventListener('online', function(e) {
            console.log('online');
        });

        dispatch(checkLoginStatusAction());

        return () => {
            removeGetMessagesOfAChatRoomFirebaseQuery(chatRoomId);
            removeGetActiveStatusOfAUserFirebaseQuery(getUserTokenOfTheDisplayNameUser(members));
        }
    }, []);

    //to get chat room details
    useEffect(() => {
        if (isSomeoneLoggedIn) {
            dispatch(getChatRoomDetailsAction(chatRoomId));
        }
    }, [isSomeoneLoggedIn]);

    //to get messages of the room and active status of the 2nd person
    useEffect(() => {
        if (isChatRoomDetailsFetched && typeof members === "object") {
            getMessagesOfAChatRoom(dispatch, chatRoomId);
            getActiveStatusOfAUser(dispatch, getUserTokenOfTheDisplayNameUser(members));
        }
    }, [isChatRoomDetailsFetched, members]);

    //to scroll the chat window to bottom when a new message comes
    useEffect(() => {
        if (chatRoomMessages) {
            scrollADivToBottom("chatContent");
        }
    }, [chatRoomMessages]);

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

    async function handleSendMsgBtnClick(e) {
        e.preventDefault();

        if (msgText !== "") {
            await sendMessageInAChatRoom(chatRoomId, msgText, "text");
            setMsgText("");
        }
    }

    function renderMessages() {
        const loggedUserToken = getLoggedUserToken();

        const messageIds = [];
        const toRender = chatRoomMessages.map(function(msg, index) {
            if (typeof msg !== "object") return;

            const messageId = msg.messageId;
            const type = msg.type;
            const formattedTime = dayjs(msg.time).format("LT");

            if (messageIds.includes(messageId)) return;

            messageIds.push(messageId);
            if (type === MSG_TYPE_IMAGE) {

            } else {
                return (
                    <div key={messageId + index} className={"messageContainer"} >
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
                                    <div className="onlineStatus">
                                        {
                                            activeStatusOfAUser ?
                                                activeStatusOfAUser === "online" ?
                                                    activeStatusOfAUser
                                                    : dayjs(activeStatusOfAUser).format("lll")
                                                : null
                                        }
                                    </div>
                                </div>
                            </div>

                            <div id="chatContent" className="chatContent">
                                {
                                    isGettingChatRoomMessages ?
                                        <LoadingAnimation loading={true} className="chatWindowLoader" />
                                        : renderMessages()
                                }
                            </div>
                        </div>

                        <form
                            className="chatActionBox"
                            style={{ "--actionBoxHeight": CHAT_ACTION_BOX_HEIGHT }}
                            onSubmit={handleSendMsgBtnClick}
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
                            <img alt="sendIcon" src={sendIcon} onClick={handleSendMsgBtnClick} />
                        </form>
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
        isGettingChatRoomMessages: state.isGettingChatRoomMessages,
        activeStatusOfAUser: state.activeStatusOfAUser,
        chatRoomDetails: state.chatRoomDetails,
        chatRoomMessages: state.chatRoomMessages,
    }
}

export default connect(mapStateToProps, undefined)(Chat);