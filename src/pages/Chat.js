import React, { useState, useEffect } from "react";
import { connect } from 'react-redux';
import { Redirect } from "react-router-dom";
import cx from "classnames";

import sendIcon from "../images/send2.png";
import uploadImgIcon from "../images/uploadImg.png";
import LandingPageDesign from "../components/LandingPageDesign";
import PurpleGradientContainer from "../components/PurpleGradientContainer";

import { CHAT_ACTION_BOX_HEIGHT } from "../constants";
import {
    checkLoginStatusAction,
    getChatRoomDetailsAction
} from "../redux/actions/index";
import {
    setUserActiveStatus,
} from "../firebaseQueries";

function Chat({
    isCheckingLoginStatus,
    isSomeoneLoggedIn,
    isGettingChatRoomDetails,
    isChatRoomDetailsFetched,
    chatRoomDetails: {
        displayName
    } = {},
    match: {
        params: {
            chatRoomId,
        } = {}
    } = {},
    dispatch,
}) {
    const [msgText, setMsgText] = useState("");

    useEffect(() => {
        dispatch(checkLoginStatusAction());
        dispatch(getChatRoomDetailsAction(chatRoomId));
    }, []);

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
                    <LandingPageDesign isCheckingLoginStatus={isCheckingLoginStatus} />
                    :
                    <PurpleGradientContainer childrenClassName="homeContainer">
                        <div
                            className="chatWindow"
                            style={{
                                "--actionBoxHeight": CHAT_ACTION_BOX_HEIGHT,
                            }}
                        >
                            <div className="chatTitle">
                                <div className="lightTitle">{displayName}</div>
                                <div className="onlineStatus">23 mins ago</div>
                            </div>
                            <div className="chatContent">
                                <div className={cx("message", "myMessageAlignment")}>
                                    <div className="myMessage">
                                        yobiroyobiroyobiroyobiroyobiroyobiroyobiroyobiroyobiroyobiroyobiroyobiroyobiroyobiroyobiroyo biroyo biroyo biroyo biroyo biroyo biroyo biroyo biroyo biroyo biroyo biroyo biroyo biroyo biroyo biroyo biroyo biroyo biroyo biroyo biroyo biroyo biroyo biroyo biroyo biroyo biroyo biroyo biroyo biroyo biroyo biroyo biroyo biroyo biroyo biroyo biroyo biroyo biroyo biroyo biroyo biroyo biroyo biro
                                    </div>
                                </div>

                                <div className={cx("message")}>
                                    <div className="theirMessage">
                                        yobiroyobiroyobiroyobiroyobiroyobiroyobiroyobiroyobiroyobiroyobiroyobiroyobiroyobiroyobiroyo biroyo biroyo biroyo biroyo biroyo biroyo biroyo biroyo biroyo biroyo biroyo biroyo biroyo biroyo biroyo biroyo biroyo biroyo biroyo biroyo biroyo biroyo biroyo biroyo biroyo biroyo biroyo biroyo biroyo biroyo biroyo biroyo biroyo biroyo biroyo biroyo biroyo biroyo biroyo biroyo biroyo biroyo biro
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div
                            className="chatActionBox"
                            style={{
                                "--actionBoxHeight": CHAT_ACTION_BOX_HEIGHT,
                            }}
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
        chatRoomDetails: state.chatRoomDetails,
    }
}

export default connect(mapStateToProps, undefined)(Chat);