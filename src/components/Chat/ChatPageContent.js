import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import localizedFormat from 'dayjs/plugin/localizedFormat';

import closeIcon from "../../images/close.png";
import sendIcon from "../../images/send2.png";
import uploadImgIcon from "../../images/uploadImg.png";
import LoadingAnimation from "../LoadingAnimation";
import ImageViewer from "../ImageViewer";
import ImageWithLoader from "../ImageWithLoader";
import ChatTitleBar from "./ChatTitleBar";
import MessageItem from "../MessageItem";

import dayjs from "../../dayjs";
import { showSnackBarAction, uploadImageInFirebaseSuccessAction, uploadImageInFirebaseFailureAction } from "../../redux/actions/index";
import {
    TITLE_BAR_HEIGHT,
    BOTTOM_NAV_HEIGHT,
    REPLY_PREVIEW_BOX_HEIGHT,
    BOTTOM_NAV_WITH_REPLY_PREVIEW_BOX_HEIGHT,
    MSG_TYPE_IMAGE,
    MSG_TYPE_REPLY,
    ALLOWED_IMAGE_TYPES,
    STANDARD_DATE_FORMAT,
    DEFAULT_DATE,
} from "../../constants";
import {
    setUserActiveStatus,
    getActiveStatusOfAUser,
    getMessagesOfAChatRoom,
    getPaginatedMessages,
    removeGetMessagesOfAChatRoomFirebaseQuery,
    sendMessageInAChatRoom,
    readingNewMessagesOfTheLoggedUserForThatChatRoom,
    setUserTypeStatus,
    getTypeStatusOfAUser,
    getUnreadMsgCountOfTheSecondUser,
    removeGetUnreadMsgCountOfTheSecondUserFirebaseQuery,
    uploadImageInFirebase,
} from "../../firebaseQueries";

const TODAY = dayjs().format(STANDARD_DATE_FORMAT);
const YESTERDAY = dayjs().subtract(1, "day").format(STANDARD_DATE_FORMAT);

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
    activeStatusOfAUser,
    typeStatusOfAUser,
    chatRoomMessages = [],
    dispatch,
}) {
    dayjs.extend(localizedFormat);

    const imageInputRef = useRef();
    const textInputRef = useRef();
    const chatContentRef = useRef(null);

    const [selectedMsgForReply, setSelectedMsgForReply] = useState(null);
    const [viewImg, setViewImg] = useState(null);
    const [choosedImg, setChoosedImg] = useState(null);
    const [msgText, setMsgText] = useState("");
    const [msgIdToScrollTo, setMmsgIdToScrollTo] = useState(null);

    //to get messages of the room
    //getting active status of the 2nd user and setting active status of the logged user
    useEffect(() => {
        getActiveStatusOfAUser(dispatch, selectedUserToken);
        getMessagesOfAChatRoom(dispatch, chatRoomId);
        getUnreadMsgCountOfTheSecondUser(dispatch, chatRoomId, selectedUserToken);
        readingNewMessagesOfTheLoggedUserForThatChatRoom(chatRoomId);
        setUserActiveStatus();
        getTypeStatusOfAUser(dispatch, chatRoomId, selectedUserToken);

        const setActiveStatusInterval = setInterval(function() {
            getActiveStatusOfAUser(dispatch, selectedUserToken);
            setUserActiveStatus();
        }, 10000); //setting user lastActive time every 10 seconds
        // other users need to compare their local time with that user lastActiveTime to get his active status

        const getTypeStatusInterval = setInterval(function() {
            getTypeStatusOfAUser(dispatch, chatRoomId, selectedUserToken);
        }, 1000); //getting user typings status in 1 s
        //other users need to compare their local time with that user lastTypedTime to get his typing status

        return () => {
            removeGetMessagesOfAChatRoomFirebaseQuery(chatRoomId);
            removeGetUnreadMsgCountOfTheSecondUserFirebaseQuery(chatRoomId, selectedUserToken)
            clearInterval(setActiveStatusInterval);
            clearInterval(getTypeStatusInterval);
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

    async function handleSendMsgBtnClick(e) {
        e.preventDefault();

        if (choosedImg) {
            await uploadImageInFirebase(dispatch, choosedImg)
                .then((snapshot) => {
                    snapshot.getDownloadURL()
                        .then((downloadURL) => {
                            if (downloadURL) {
                                sendMessageInAChatRoom(chatRoomId, downloadURL, MSG_TYPE_IMAGE, selectedUserToken);
                                setChoosedImg(null);
                            }
                            dispatch(uploadImageInFirebaseSuccessAction());
                        });
                })
                .catch((error) => {
                    dispatch(uploadImageInFirebaseFailureAction({ msg: "Fail to upload image" }));
                });
        } else {
            if (msgText.trim() !== "") {
                setMsgText("");
                if (selectedMsgForReply) {
                    setSelectedMsgForReply(null);
                    await sendMessageInAChatRoom(chatRoomId, msgText, MSG_TYPE_REPLY, selectedUserToken, selectedMsgForReply);
                } else {
                    await sendMessageInAChatRoom(chatRoomId, msgText, "text", selectedUserToken);
                }
            }
        }
    }

    function handleChangeMsgInput(e) {
        setMsgText(e.target.value)
        setUserTypeStatus(chatRoomId);
    }

    function handleImageUploadIconClick() {
        imageInputRef.current && imageInputRef.current.click();
    }

    async function handleSelectImage(event) {
        try {
            if (event.target.files && event.target.files[0]) {
                const selectedImg = event.target.files[0];
                const selectedImgType = selectedImg.type;
                if (ALLOWED_IMAGE_TYPES.includes(selectedImgType)) {
                    setChoosedImg(selectedImg);
                } else {
                    dispatch(showSnackBarAction("Only images are allowed"));
                }
            }
        } catch (e) {
            dispatch(showSnackBarAction("Fail to select image", e));
        }
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
                    <div className="dividerDate">
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
                    <MessageItem
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
                style={{
                    "--actionBoxHeight":
                        selectedMsgForReply ?
                            BOTTOM_NAV_WITH_REPLY_PREVIEW_BOX_HEIGHT
                            : BOTTOM_NAV_HEIGHT
                }}
            >
                <ChatTitleBar
                    name={selectedUserName}
                    profileImg={selectedUserProfileImg}
                    typeStatus={typeStatusOfAUser}
                    activeStatus={activeStatusOfAUser}
                    onImageClick={handleImageClick}
                />

                <div
                    id="chatContent"
                    className="chatContent"
                    style={{ "--titleBarHeight": TITLE_BAR_HEIGHT }}
                >
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

            {
                selectedMsgForReply ?
                    <div className="replyMsgPreviewContainer" style={{ "--replyBoxHeight": REPLY_PREVIEW_BOX_HEIGHT }} >
                        {
                            selectedMsgForReply.type === MSG_TYPE_IMAGE ?
                                <ImageWithLoader
                                    className="replyMsgPreviewImg"
                                    src={selectedMsgForReply.message}
                                    onClick={(event) => handleImageClick(event, selectedMsgForReply.message)}
                                />
                                :
                                <div className="replyMsgPreviewMsg" title={selectedMsgForReply.message}>{selectedMsgForReply.message}</div>
                        }
                    </div>
                    : null
            }

            <form
                className="chatBottomNavContainer"
                style={{ "--actionBoxHeight": BOTTOM_NAV_HEIGHT }}
                onSubmit={handleSendMsgBtnClick}
            >
                {
                    isUploadingImage ?
                        <LoadingAnimation dark loading={isUploadingImage} />
                        :
                        <>
                            {
                                choosedImg ?
                                    <>
                                        <img alt="closeIcon" className="closeIcon" src={closeIcon} onClick={() => setChoosedImg(null)} />
                                        <img alt="choosenImg" className="sendImgPreview" src={URL.createObjectURL(choosedImg)} />
                                    </>
                                    :
                                    <>
                                        <input
                                            ref={imageInputRef}
                                            style={{ display: "none" }}
                                            type="file"
                                            name="myImage"
                                            onChange={handleSelectImage}
                                            accept="image/*"
                                        />

                                        {
                                            selectedMsgForReply ?
                                                <img alt="closeIcon" className="closeIcon" src={closeIcon} onClick={() => setSelectedMsgForReply(null)} />
                                                :
                                                <img alt="uploadImgIcon" className="chatActionBoxImg" src={uploadImgIcon} onClick={handleImageUploadIconClick} />
                                        }

                                        <input
                                            ref={textInputRef}
                                            type="text"
                                            className="sendMsgTextInput"
                                            placeholder="type message"
                                            value={msgText}
                                            onChange={handleChangeMsgInput}
                                        />
                                    </>
                            }

                            <img alt="sendIcon" src={sendIcon} onClick={handleSendMsgBtnClick} className="chatActionBoxImg" />
                        </>
                }
            </form>
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
        activeStatusOfAUser: state.activeStatusOfAUser,
        typeStatusOfAUser: state.typeStatusOfAUser,
        chatRoomMessages: state.chatRoomMessages,
    }
}

export default connect(mapStateToProps, undefined)(ChatPageContent);