import React, { useState, useEffect } from "react";
import { connect } from 'react-redux';
import { Redirect } from "react-router-dom";

import userIcon from "../images/user.png";
import LoadingAnimation from "../components/LoadingAnimation";
import ActionButton from "../components/ActionButton";

import { CHAT_ACTION_BOX_HEIGHT } from "../constants";
import { showSnackBarAction } from "../redux/actions/index";
import { startANewChatRoom } from "../firebaseQueries";
import { redirectToLoginPage } from "../utils";

function NewChat({
    isCheckingLoginStatus,
    isSomeoneLoggedIn,
    isStartingANewChatRoom,
    isANewChatRoomStarted,
    newChatRoomDetails: {
        chatRoomId,
    },
    userDetails: {
        username: loggedUsername
    } = {},
    match: {
        params: {
            selectedUserDetails,
        } = {}
    } = {},
    dispatch,
}) {
    const [redirectToChat, setRedirectToChat] = useState(false);
    const [secondUserDetails, setSecondUserDetails] = useState({});

    useEffect(() => {
        if (isSomeoneLoggedIn) {
            try {
                const selectedUserDetailsObj = JSON.parse(selectedUserDetails);
                const secondUsername = selectedUserDetailsObj.name;
                const secondUserToken = selectedUserDetailsObj.token;
                if (secondUsername && secondUserToken) {
                    setSecondUserDetails({ secondUserToken, secondUsername });
                } else {
                    dispatch(showSnackBarAction("Invalid user selected"));
                }
            } catch (e) {
                dispatch(showSnackBarAction("Invalid user selected"));
            }
        }
    }, [isSomeoneLoggedIn]);

    useEffect(() => {
        if (isANewChatRoomStarted && chatRoomId) {
            setRedirectToChat(true);
        }
    }, [isANewChatRoomStarted]);

    function handleStartBtnClick() {
        startANewChatRoom({ dispatch, loggedUsername, ...secondUserDetails });
    }

    return (
        <>
            {redirectToChat ? <Redirect to={"/chat/" + chatRoomId} /> : null}
            {redirectToLoginPage(isCheckingLoginStatus, isSomeoneLoggedIn)}

            {
                (!secondUserDetails.secondUsername) || !isSomeoneLoggedIn ?
                    <LoadingAnimation dark loading />
                    :
                    <div className="homeContainer">
                        <div
                            className="chatWindow"
                            style={{ "--actionBoxHeight": CHAT_ACTION_BOX_HEIGHT }}
                        >
                            <div className="chatTitle">
                                <img alt="userIcon" src={userIcon} />
                                <div>
                                    <div className="lightTitle">{secondUserDetails.secondUsername}</div>
                                </div>
                            </div>

                            <div id="chatContent" className="chatContent"></div>
                            <div
                                className="chatActionBox"
                                style={{ "--actionBoxHeight": CHAT_ACTION_BOX_HEIGHT }}
                            >
                                <ActionButton
                                    dark={false}
                                    showLoader={isStartingANewChatRoom}
                                    buttonText="Start Chat"
                                    onClick={handleStartBtnClick}
                                />
                            </div>
                        </div>
                    </div>
            }
        </>
    );
}

const mapStateToProps = (state) => {
    return {
        isCheckingLoginStatus: state.isCheckingLoginStatus,
        isSomeoneLoggedIn: state.isSomeoneLoggedIn,
        isStartingANewChatRoom: state.isStartingANewChatRoom,
        isANewChatRoomStarted: state.isANewChatRoomStarted,
        newChatRoomDetails: state.newChatRoomDetails,
        userDetails: state.userDetails,
    }
}

export default connect(mapStateToProps, undefined)(NewChat);