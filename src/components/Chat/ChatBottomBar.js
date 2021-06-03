import React, { useState, useRef } from "react";

import closeIcon from "../../images/close.png";
import sendIcon from "../../images/send2.png";
import uploadImgIcon from "../../images/uploadImg.png";
import LoadingAnimation from "../LoadingAnimation";
import ImageWithLoader from "../ImageWithLoader";
import { REPLY_PREVIEW_BOX_HEIGHT, BOTTOM_NAV_HEIGHT, BOTTOM_BAR_GRADIENT, MESSAGE_INPUT_GRADIENT, MSG_TYPE_IMAGE, MSG_TYPE_REPLY, ALLOWED_IMAGE_TYPES } from "../../constants";
import { encryptText, decryptText } from "../../encryptionUtil";
import { showSnackBarAction, uploadImageInFirebaseSuccessAction, uploadImageInFirebaseFailureAction } from "../../redux/actions/index";
import { sendMessageInAChatRoom, setUserTypeStatus } from "../../firebaseQueries";
import { uploadImageInFirebase } from "../../firebaseUpload";

export default function ChatBottomBar({
    isUploadingImage,
    chatRoomId,
    selectedUserToken,
    textInputRef,
    selectedMsgForReply = {},
    resetSelectedMessageForReply,
    onImageClick,
    dispatch
}) {
    const selectedReplyMessage = decryptText((selectedMsgForReply || {}).message);
    const selectedReplyType = (selectedMsgForReply || {}).type;
    const imageInputRef = useRef();

    const [choosedImg, setChoosedImg] = useState(null);
    const [msgText, setMsgText] = useState("");

    function handleImageClick(event) {
        if (selectedReplyMessage) {
            onImageClick(event, selectedReplyMessage)
        }
    }

    async function handleSendMsgBtnClick(e) {
        e.preventDefault();

        if (choosedImg) {
            await uploadImageInFirebase(dispatch, choosedImg)
                .then((snapshot) => {
                    snapshot.getDownloadURL()
                        .then((downloadURL) => {
                            if (downloadURL) {
                                sendMessageInAChatRoom(chatRoomId, encryptText(downloadURL), MSG_TYPE_IMAGE, selectedUserToken);
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
                if (selectedReplyType) {
                    resetSelectedMessageForReply();
                    await sendMessageInAChatRoom(chatRoomId, encryptText(msgText), MSG_TYPE_REPLY, selectedUserToken, selectedMsgForReply);
                } else {
                    await sendMessageInAChatRoom(chatRoomId, encryptText(msgText), "text", selectedUserToken);
                }
            }
        }
    }

    function handleChangeMsgInput(e) {
        setMsgText(e.target.value)
        setUserTypeStatus(chatRoomId);
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

    function handleImageUploadIconClick() {
        imageInputRef.current && imageInputRef.current.click();
    }

    return (
        <>
            {
                selectedReplyType ?
                    <div className="replyMsgPreviewContainer" style={{ "--replyBoxHeight": REPLY_PREVIEW_BOX_HEIGHT }} >
                        {
                            selectedReplyType === MSG_TYPE_IMAGE ?
                                <ImageWithLoader
                                    className="replyMsgPreviewImg"
                                    src={selectedReplyMessage}
                                    onClick={handleImageClick}
                                />
                                :
                                <div className="replyMsgPreviewMsg" title={selectedReplyMessage}>{selectedReplyMessage}</div>
                        }
                    </div>
                    : null
            }

            <form
                className="chatBottomBarContainer"
                style={{ "--actionBoxHeight": BOTTOM_NAV_HEIGHT, background: BOTTOM_BAR_GRADIENT }}
                onSubmit={handleSendMsgBtnClick}
            >
                {
                    isUploadingImage ? <LoadingAnimation dark loading />
                        :
                        <>
                            {
                                choosedImg ?
                                    <>
                                        <img className="chatBottomBarCloseImg" src={closeIcon} onClick={() => setChoosedImg(null)} />
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
                                            selectedReplyType ?
                                                <img className="chatBottomBarCloseImg" src={closeIcon} onClick={resetSelectedMessageForReply} />
                                                :
                                                <img alt="uploadImgIcon" className="chatBottomBarImg" src={uploadImgIcon} onClick={handleImageUploadIconClick} />
                                        }

                                        <input
                                            ref={textInputRef}
                                            type="text"
                                            className="sendMsgTextInput"
                                            style={{ background: MESSAGE_INPUT_GRADIENT }}
                                            placeholder="type message"
                                            value={msgText}
                                            onChange={handleChangeMsgInput}
                                        />
                                    </>
                            }

                            <img alt="sendIcon" src={sendIcon} onClick={handleSendMsgBtnClick} className="chatBottomBarImg" />
                        </>
                }
            </form>
        </>
    )
}