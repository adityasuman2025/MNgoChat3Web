import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import localizedFormat from 'dayjs/plugin/localizedFormat';

import LoadingAnimation from "../LoadingAnimation";
import ImageViewer from "../ImageViewer";
import ChatTitleBar from "./ChatTitleBar";
import ChatBottomBar from "./ChatBottomBar";
import ChatMessageItem from "./ChatMessageItem";

import dayjs from "../../dayjs";
import { resetDataOfAChatRoomAction } from "../../redux/actions/index";
import { TITLE_BAR_HEIGHT, BOTTOM_NAV_HEIGHT, BOTTOM_NAV_WITH_REPLY_PREVIEW_BOX_HEIGHT, STANDARD_DATE_FORMAT, DEFAULT_DATE } from "../../constants";
import {
    getLastSeenOfAUser,
    getMessagesOfAChatRoom,
    getPaginatedMessages,
    removeGetMessagesOfAChatRoomFirebaseQuery,
    readingNewMessagesOfTheLoggedUserForThatChatRoom,
    getTypeStatusOfAUser,
    getUnreadMsgCountOfTheSecondUser,
    removeGetUnreadMsgCountOfTheSecondUserFirebaseQuery,
    removeGetTypeStatusOfAUserFirebaseQuery,
} from "../../firebaseQueries";

const TODAY = dayjs().format(STANDARD_DATE_FORMAT);
const YESTERDAY = dayjs().subtract(1, "day").format(STANDARD_DATE_FORMAT);

/* eslint-disable react-hooks/exhaustive-deps */
function ChatPageContent({
    isGettingChatRoomMessages,
    isInitialMessagesFetched,
    isPaginatedMessagesFetched,
    isUploadingImage,
    isANewMessage,
    chatRoomId,
    selectedUserName,
    selectedUserToken,
    selectedUserProfileImg,
    unreadMsgCountOfTheSecondUser,
    lastSeenOfAUser,
    typeStatusOfAUser,
    chatRoomMessages = [],
    activeUsersList = [],
    dispatch,
}) {
    dayjs.extend(localizedFormat);

    const textInputRef = useRef();
    const chatContentRef = useRef(null);

    const [selectedMsgForReply, setSelectedMsgForReply] = useState(null);
    const [viewImg, setViewImg] = useState(null);

    const [msgIdToScrollTo, setMmsgIdToScrollTo] = useState(null);

    useEffect(() => {
        if (!activeUsersList.includes(selectedUserName)) {
            getLastSeenOfAUser(dispatch, selectedUserToken);
        }
    }, [activeUsersList]);

    //to get messages of the room
    //getting active status of the 2nd user and setting active status of the logged user
    useEffect(() => {
        getMessagesOfAChatRoom(dispatch, chatRoomId);
        getUnreadMsgCountOfTheSecondUser(dispatch, chatRoomId, selectedUserToken);
        getTypeStatusOfAUser(dispatch, chatRoomId, selectedUserToken);
        readingNewMessagesOfTheLoggedUserForThatChatRoom(chatRoomId);

        return () => {
            dispatch(resetDataOfAChatRoomAction());

            removeGetMessagesOfAChatRoomFirebaseQuery(chatRoomId);
            removeGetUnreadMsgCountOfTheSecondUserFirebaseQuery(chatRoomId, selectedUserToken)
            removeGetTypeStatusOfAUserFirebaseQuery(chatRoomId, selectedUserToken);
            readingNewMessagesOfTheLoggedUserForThatChatRoom(chatRoomId);
        }
    }, []);

    useEffect(() => {
        if (isInitialMessagesFetched) {
            chatContentRef.current && chatContentRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }, [isInitialMessagesFetched]);

    //to scroll the chat window to bottom when a new message comes
    useEffect(() => {
        chatContentRef.current && chatContentRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });

        readingNewMessagesOfTheLoggedUserForThatChatRoom(chatRoomId);
    }, [isANewMessage]);

    //when paginated messages are fetched then scrolling the chatContent div to 10px below from top
    //so that scroll can be triggered easily to fetch another paginated msg
    useEffect(() => {
        if (isPaginatedMessagesFetched) {
            var chatContentDiv = document.getElementById('chatContent');
            chatContentDiv.scrollTop = 10;
        }
    }, [isPaginatedMessagesFetched]);

    function loadMoreMessages() {
        const messageIdOfTheFirstMessageInList = (chatRoomMessages[0] || {}).messageId;
        getPaginatedMessages(dispatch, chatRoomId, messageIdOfTheFirstMessageInList);
    }

    function handleImageClick(event, src) {
        event.stopPropagation(); //to prevent trigger of parent onClick

        if (src) {
            setViewImg(src);
        }
    }

    function handleReplyIconClick(event, msg) {
        event.stopPropagation(); //to prevent trigger of parent onClick

        if (!msg) return;
        setSelectedMsgForReply(msg);
        textInputRef.current && textInputRef.current.focus();
    }

    function resetSelectedMessageForReply(event) {
        setSelectedMsgForReply(null);
    }

    function handleOriginalMsgClick(orgMsgId) {
        if (!orgMsgId) return;
        setMmsgIdToScrollTo(orgMsgId);

        //resetting msgIdToScrollTo to null
        setTimeout(function() {
            setMmsgIdToScrollTo(null);
        }, 1000);
    }

    function renderMessages() {
        let lastDividerDate = null;

        const chatRoomMessagesCount = chatRoomMessages.length;
        const toRender = chatRoomMessages.map(function(msg, index) {
            if (typeof msg !== "object") return;

            let dateHTML = [];
            const date = dayjs(msg.time).format(STANDARD_DATE_FORMAT);
            if (lastDividerDate !== date && date !== "Invalid Date") {
                dateHTML.push(
                    <div key={date + index} className="dividerDate">
                        <div className="dividerLine" />
                        <div className="dividerText">
                            {
                                date === TODAY ?
                                    "today"
                                    : date === YESTERDAY ?
                                        "yesterday"
                                        : date
                            }
                        </div>
                        <div className="dividerLine" />
                    </div>
                );
                lastDividerDate = date;
            }

            return (
                <>
                    {dateHTML}
                    <ChatMessageItem
                        key={msg.messageId + index}
                        isSeen={unreadMsgCountOfTheSecondUser < chatRoomMessagesCount - index}
                        formattedTime={
                            dayjs(msg.time).format("LT") === "Invalid Date" ?
                                dayjs(DEFAULT_DATE + msg.time).format("LT")
                                : dayjs(msg.time).format("LT")
                        }
                        msgIdToScrollTo={msgIdToScrollTo}
                        msg={msg}
                        onImageClick={handleImageClick}
                        onReplyIconClick={handleReplyIconClick}
                        onOriginalMsgClick={handleOriginalMsgClick}
                    />
                </>
            )
        });

        return toRender;
    }

    return (
        <div className="homeContainer">
            {viewImg ? <ImageViewer src={viewImg} onClose={() => setViewImg(null)} /> : null}

            <div
                className="chatWindow"
                style={{ "--actionBoxHeight": selectedMsgForReply ? BOTTOM_NAV_WITH_REPLY_PREVIEW_BOX_HEIGHT : BOTTOM_NAV_HEIGHT }}
            >
                <ChatTitleBar
                    name={selectedUserName}
                    profileImg={selectedUserProfileImg}
                    typeStatus={typeStatusOfAUser}
                    activeStatus={
                        activeUsersList.includes(selectedUserName)
                            ? "online"
                            : lastSeenOfAUser
                                ? dayjs(lastSeenOfAUser).format("lll")
                                : ""
                    }
                    onImageClick={handleImageClick}
                />

                <div id="chatContent" style={{ "--titleBarHeight": TITLE_BAR_HEIGHT }}>
                    <InfiniteScroll
                        hasMore={true}
                        inverse={true}
                        scrollThreshold={1}
                        dataLength={chatRoomMessages.length}
                        scrollableTarget="chatContent"
                        next={loadMoreMessages}
                    >
                        <>
                            <LoadingAnimation dark loading={isGettingChatRoomMessages} className="chatWindowLoader" />
                            {renderMessages()}
                        </>
                    </InfiniteScroll>
                    <div style={{ float: "left", clear: "both" }} ref={chatContentRef} />
                </div>
            </div>

            <ChatBottomBar
                isUploadingImage={isUploadingImage}
                chatRoomId={chatRoomId}
                selectedUserToken={selectedUserToken}
                textInputRef={textInputRef}
                selectedMsgForReply={selectedMsgForReply}
                resetSelectedMessageForReply={resetSelectedMessageForReply}
                onImageClick={handleImageClick}
                dispatch={dispatch}
            />
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        isGettingChatRoomMessages: state.isGettingChatRoomMessages,
        isInitialMessagesFetched: state.isInitialMessagesFetched,
        isPaginatedMessagesFetched: state.isPaginatedMessagesFetched,
        isUploadingImage: state.isUploadingImage,
        isANewMessage: state.isANewMessage,
        unreadMsgCountOfTheSecondUser: state.unreadMsgCountOfTheSecondUser,
        lastSeenOfAUser: state.lastSeenOfAUser,
        typeStatusOfAUser: state.typeStatusOfAUser,
        chatRoomMessages: state.chatRoomMessages,
        activeUsersList: state.activeUsersList,
    }
}

export default connect(mapStateToProps, undefined)(ChatPageContent);