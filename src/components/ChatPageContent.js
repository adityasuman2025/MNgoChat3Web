import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import imageCompression from 'browser-image-compression';
import cx from "classnames";
import localizedFormat from 'dayjs/plugin/localizedFormat';

import closeIcon from "../images/close.png";
import userIcon from "../images/user.png";
import sendIcon from "../images/send2.png";
import uploadImgIcon from "../images/uploadImg.png";
import PurpleGradientContainer from "./PurpleGradientContainer";
import LoadingAnimation from "./LoadingAnimation";
import ImageViewer from "./ImageViewer";
import ImageWithLoader from "./ImageWithLoader";

import dayjs from "../dayjs";
import { getLoggedUserToken, scrollADivToBottom } from "../utils";
import { showSnackBarAction } from "../redux/actions/index";
import {
    CHAT_ACTION_BOX_HEIGHT,
    MSG_TYPE_IMAGE,
    DEFAULT_DATE,
    IMAGE_COMPRESSION_OPTIONS,
    ALLOWED_IMAGE_TYPES,
} from "../constants";
import {
    setUserActiveStatus,
    getActiveStatusOfAUser,
    getMessagesOfAChatRoom,
    removeGetMessagesOfAChatRoomFirebaseQuery,
    sendMessageInAChatRoom,
    readingNewMessagesOfTheLoggedUserForThatChatRoom,
    setUserTypeStatus,
    getTypeStatusOfAUser,
    uploadImageInFirebase,
} from "../firebaseQueries";

function ChatPageContent({
    isGettingChatRoomMessages,
    isUploadingImage,
    chatRoomId,
    activeStatusOfAUser,
    typeStatusOfAUser,
    chatRoomDetails: {
        usernameOfSecondUser,
        userTokenOfSecondUser,
    } = {},
    chatRoomMessages = [],
    uploadedImageDetails: {
        downloadUrl,
    } = {},
    dispatch,
}) {
    const imageInputRef = useRef();
    dayjs.extend(localizedFormat);

    const [viewImg, setViewImg] = useState(null);
    const [choosedImg, setChoosedImg] = useState(null);
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
        getTypeStatusOfAUser(dispatch, chatRoomId, userTokenOfSecondUser);

        // const setActiveStatusInterval = setInterval(function() {
        //     getActiveStatusOfAUser(dispatch, userTokenOfSecondUser);
        //     setUserActiveStatus(true);
        // }, 10000); //setting user lastActive time every 10 seconds
        //other users need to compare their local time with that user lastActiveTime to get his active status

        // const getTypeStatusInterval = setInterval(function() {
        //     getTypeStatusOfAUser(dispatch, chatRoomId, userTokenOfSecondUser);
        // }, 1000); //getting user typings status in 1 s
        //other users need to compare their local time with that user lastTypedTime to get his typing status

        return () => {
            removeGetMessagesOfAChatRoomFirebaseQuery(chatRoomId);
            // clearInterval(setActiveStatusInterval);
            // clearInterval(getTypeStatusInterval);
        }
    }, []);

    //to scroll the chat window to bottom when a new message comes
    useEffect(() => {
        if (chatRoomMessages) {
            scrollADivToBottom("chatContent");

            readingNewMessagesOfTheLoggedUserForThatChatRoom(chatRoomId);
        }
    }, [chatRoomMessages]);

    useEffect(() => {
        if (downloadUrl) {
            sendMessageInAChatRoom(chatRoomId, downloadUrl, "image", userTokenOfSecondUser);
            setChoosedImg(null);
        }
    }, [downloadUrl]);

    async function handleSendMsgBtnClick(e) {
        e.preventDefault();

        if (choosedImg) {
            await uploadImageInFirebase(dispatch, choosedImg);
        } else {
            if (msgText.trim() !== "") {
                await sendMessageInAChatRoom(chatRoomId, msgText, "text", userTokenOfSecondUser);
                setMsgText("");
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
                    console.log(`originalFile size ${selectedImg.size / 1024} KB`);
                    const compressedImg = await imageCompression(selectedImg, IMAGE_COMPRESSION_OPTIONS);
                    console.log(`compressedFile size ${compressedImg.size / 1024} KB`); // smaller than maxSizeMB

                    setChoosedImg(compressedImg);
                } else {
                    dispatch(showSnackBarAction("Only images are allowed"));
                }
            }
        } catch (e) {
            dispatch(showSnackBarAction("Fail to select image", e));
        }
    }

    function handleCloseIconClick() {
        setChoosedImg(null);
    }

    function handleImageClick(src) {
        if (src) {
            setViewImg(src);
        }
    }

    function renderMessages() {
        const loggedUserToken = getLoggedUserToken();

        const messageIds = [];
        const toRender = chatRoomMessages.map(function(msg, index) {
            if (typeof msg !== "object") return;

            const messageId = msg.messageId;
            const type = msg.type;
            const formattedTime = dayjs(DEFAULT_DATE + msg.time).format("LT");

            if (messageIds.includes(messageId)) return;
            messageIds.push(messageId);

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
                            {
                                type === MSG_TYPE_IMAGE ?
                                    <ImageWithLoader src={msg.message} onClick={() => handleImageClick(msg.message)} />
                                    : msg.message
                            }
                        </div>
                    </div>
                    <div className="messageTime">{formattedTime}</div>
                </div>
            )
        });

        return toRender;
    }

    return (
        <PurpleGradientContainer childrenClassName="homeContainer">
            {
                viewImg ?
                    <ImageViewer src={viewImg} onClose={() => setViewImg(null)} />
                    : null
            }

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
                                typeStatusOfAUser ?
                                    typeStatusOfAUser
                                    :
                                    activeStatusOfAUser ?
                                        activeStatusOfAUser !== "online" ?
                                            dayjs(activeStatusOfAUser).format("lll")
                                            : "online"
                                        : ""
                            }
                        </div>
                    </div>
                </div>

                <div id="chatContent" className="chatContent">
                    {
                        isGettingChatRoomMessages ?
                            <LoadingAnimation loading={true} className="chatWindowLoader" />
                            :
                            renderMessages()
                    }
                </div>
            </div>

            <form
                className="chatActionBox"
                style={{ "--actionBoxHeight": CHAT_ACTION_BOX_HEIGHT }}
                onSubmit={handleSendMsgBtnClick}
            >
                {
                    isUploadingImage ?
                        <LoadingAnimation loading={isUploadingImage} />
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
                                choosedImg ?
                                    <>
                                        <img alt="closeIcon" src={closeIcon} onClick={handleCloseIconClick} className="closeIcon" />
                                        <img alt="choosenImg" src={URL.createObjectURL(choosedImg)} className="sendImgPreview" />
                                    </>
                                    :
                                    <>
                                        <img alt="uploadImgIcon" src={uploadImgIcon} onClick={handleImageUploadIconClick} className="chatActionBoxImg" />
                                        <input
                                            type="text"
                                            className="sendMsgTextInput"
                                            placeholder="type message"
                                            autoFocus
                                            value={msgText}
                                            onChange={handleChangeMsgInput}
                                        />
                                    </>
                            }

                            <img alt="sendIcon" src={sendIcon} onClick={handleSendMsgBtnClick} className="chatActionBoxImg" />
                        </>
                }
            </form>
        </PurpleGradientContainer>
    )
}

const mapStateToProps = (state) => {
    return {
        isGettingChatRoomMessages: state.isGettingChatRoomMessages,
        isUploadingImage: state.isUploadingImage,
        activeStatusOfAUser: state.activeStatusOfAUser,
        typeStatusOfAUser: state.typeStatusOfAUser,
        uploadedImageDetails: state.uploadedImageDetails,
        chatRoomDetails: state.chatRoomDetails,
        chatRoomMessages: state.chatRoomMessages,
    }
}

export default connect(mapStateToProps, undefined)(ChatPageContent);