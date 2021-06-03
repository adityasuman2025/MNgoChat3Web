import React, { useState, useEffect } from "react";
import { connect } from 'react-redux';
import { Redirect } from "react-router-dom";

import LoadingAnimation from "../components/LoadingAnimation";
import ActionButton from "../components/ActionButton";
import ImageViewer from "../components/ImageViewer";
import ChatTitleBar from "../components/Chat/ChatTitleBar";
import { BOTTOM_NAV_HEIGHT } from "../constants";
import { showSnackBarAction } from "../redux/actions/index";
import { startANewChatRoom } from "../firebaseQueries";
import { redirectToLoginPage } from "../utils";
import { encryptText, decryptText } from "../encryptionUtil";

function NewChat({
    isSomeoneLoggedIn,
    isStartingANewChatRoom,
    isANewChatRoomStarted,
    newChatRoomDetails: {
        chatRoomId,
    },
    userDetails: {
        username: loggedUsername
    } = {},
    dispatch,
}) {
    const [isLoading, setIsLoading] = useState(true);
    const [selectedUserDetails, setSelectedUserDetails] = useState({});

    const [redirectToChat, setRedirectToChat] = useState(false);
    const [viewImg, setViewImg] = useState(null);

    useEffect(() => {
        try {
            const fullUrl = (window.location.href).split("new-chat/");
            const encryptedSelectedUserDetails = fullUrl[1];
            const urlUserDetails = JSON.parse(decryptText(encryptedSelectedUserDetails));
            if (urlUserDetails.token && urlUserDetails.name) {
                setSelectedUserDetails(urlUserDetails);
                setIsLoading(false);
            } else {
                dispatch(showSnackBarAction("Invalid user selected"));
            }
        } catch (e) {
            dispatch(showSnackBarAction("Invalid user selected"));
        }
    }, []);

    useEffect(() => {
        if (isANewChatRoomStarted && chatRoomId) {
            const userDetails = selectedUserDetails;
            userDetails.chatRoomId = chatRoomId;
            setSelectedUserDetails(userDetails);
            setRedirectToChat(true);
        }
    }, [isANewChatRoomStarted]);

    function handleStartBtnClick() {
        startANewChatRoom({ dispatch, loggedUsername, secondUserToken: selectedUserDetails.token, secondUsername: selectedUserDetails.name });
    }

    function handleImageClick(event, src) {
        event.stopPropagation(); //to prevent trigger of parent onClick

        if (src) {
            setViewImg(src);
        }
    }

    return (
        <>
            {!isSomeoneLoggedIn ? redirectToLoginPage() : null}
            {redirectToChat ? <Redirect to={"/chat/" + encryptText(JSON.stringify(selectedUserDetails))} /> : null}

            {viewImg ? <ImageViewer src={viewImg} onClose={() => setViewImg(null)} /> : null}

            {
                isLoading ? <LoadingAnimation dark loading />
                    :
                    <div className="homeContainer">
                        <div
                            className="chatWindow"
                            style={{ "--actionBoxHeight": BOTTOM_NAV_HEIGHT }}
                        >
                            <ChatTitleBar
                                name={selectedUserDetails.name}
                                profileImg={selectedUserDetails.profileImg}
                                onImageClick={handleImageClick}
                            />
                        </div>
                        <div
                            className="chatBottomNavContainer"
                            style={{ "--actionBoxHeight": BOTTOM_NAV_HEIGHT }}
                        >
                            <ActionButton
                                dark={false}
                                showLoader={isStartingANewChatRoom}
                                buttonText="Start Chat"
                                onClick={handleStartBtnClick}
                            />
                        </div>
                    </div>
            }
        </>
    );
}

const mapStateToProps = (state) => {
    return {
        isSomeoneLoggedIn: state.isSomeoneLoggedIn,
        isStartingANewChatRoom: state.isStartingANewChatRoom,
        isANewChatRoomStarted: state.isANewChatRoomStarted,
        newChatRoomDetails: state.newChatRoomDetails,
        userDetails: state.userDetails,
    }
}

export default connect(mapStateToProps, undefined)(NewChat);