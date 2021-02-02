import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import cx from "classnames";
import dayjs from 'dayjs';
import 'dayjs/locale/en';
import localizedFormat from 'dayjs/plugin/localizedFormat';

import userIcon from "../images/user.png";
import sendIcon from "../images/send2.png";
import uploadImgIcon from "../images/uploadImg.png";
import PurpleGradientContainer from "./PurpleGradientContainer";
import LoadingAnimation from "./LoadingAnimation";

import { CHAT_ACTION_BOX_HEIGHT, MSG_TYPE_IMAGE } from "../constants";
import {
    getLoggedUserToken,
    scrollADivToBottom
} from "../utils";
import {
    setUserActiveStatus,
    getActiveStatusOfAUser,
    getMessagesOfAChatRoom,
    removeGetMessagesOfAChatRoomFirebaseQuery,
    sendMessageInAChatRoom,
    readingNewMessagesOfTheLoggedUserForThatChatRoom,
} from "../firebaseQueries";

function ChatPageContent({
    isGettingChatRoomMessages,
    chatRoomId,
    activeStatusOfAUser,
    chatRoomDetails: {
        usernameOfSecondUser,
        userTokenOfSecondUser,
    } = {},
    chatRoomMessages = [],
    dispatch,
}) {
    dayjs.locale('en');
    dayjs.extend(localizedFormat);

    const [msgText, setMsgText] = useState("");

    //to get messages of the room
    //getting active status of the 2nd user and setting active status of the logged user
    useEffect(() => {
        // window.addEventListener('offline', function(e) {
        //     console.log('offline');
        // });

        // window.addEventListener('online', function(e) {
        //     console.log('online');
        // });

        getMessagesOfAChatRoom(dispatch, chatRoomId);
        getActiveStatusOfAUser(dispatch, userTokenOfSecondUser);
        setUserActiveStatus(true);

        const setActiveStatusInterval = setInterval(function() {
            getActiveStatusOfAUser(dispatch, userTokenOfSecondUser);
            setUserActiveStatus(true);
        }, 10000); //setting user lastActive time every 10 seconds
        //other users need to compare their local time with that user lastActiveTime to get his active status

        return () => {
            removeGetMessagesOfAChatRoomFirebaseQuery(chatRoomId);
            clearInterval(setActiveStatusInterval);
        }
    }, []);

    //to scroll the chat window to bottom when a new message comes
    useEffect(() => {
        if (chatRoomMessages) {
            scrollADivToBottom("chatContent");

            readingNewMessagesOfTheLoggedUserForThatChatRoom(chatRoomId);
        }
    }, [chatRoomMessages]);

    async function handleSendMsgBtnClick(e) {
        e.preventDefault();

        if (msgText !== "") {
            await sendMessageInAChatRoom(chatRoomId, msgText, "text", userTokenOfSecondUser);
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

    return (
        <PurpleGradientContainer childrenClassName="homeContainer">
            <div
                className="chatWindow"
                style={{ "--actionBoxHeight": CHAT_ACTION_BOX_HEIGHT }}
            >
                <div className="chatTitle">
                    <img alt="userIcon" src={userIcon} />
                    <div>
                        <div className="lightTitle">{usernameOfSecondUser}</div>
                        <div className="onlineStatus">
                            {
                                activeStatusOfAUser !== "online" ?
                                    dayjs(activeStatusOfAUser).format("lll")
                                    : "online"
                            }
                        </div>
                    </div>
                </div>

                <div id="chatContent" className="chatContent">
                    {
                        // isGettingChatRoomMessages ?
                        // <LoadingAnimation loading={true} className="chatWindowLoader" />
                        // : 
                        renderMessages()
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
    )
}

const mapStateToProps = (state) => {
    return {
        isGettingChatRoomMessages: state.isGettingChatRoomMessages,
        activeStatusOfAUser: state.activeStatusOfAUser,
        chatRoomDetails: state.chatRoomDetails,
        chatRoomMessages: state.chatRoomMessages,
    }
}

export default connect(mapStateToProps, undefined)(ChatPageContent);