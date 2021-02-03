import React, { useState, useEffect } from "react";
import { connect } from 'react-redux';
import { Redirect } from "react-router-dom";

import userIcon from "../images/user.png";
import LandingPageDesign from "../components/LandingPageDesign";
import PurpleGradientContainer from "../components/PurpleGradientContainer";
import ActionButton from "../components/ActionButton";

import { CHAT_ACTION_BOX_HEIGHT } from "../constants";
import { checkLoginStatusAction, showSnackBarAction } from "../redux/actions/index";
import { startANewChatRoom } from "../firebaseQueries";

function NewChat({
    isCheckingLoginStatus,
    isSomeoneLoggedIn,
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
    const [secondUserDetails, setSecondUserDetails] = useState({});

    useEffect(() => {
        dispatch(checkLoginStatusAction());
    }, []);

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

    function handleStartBtnClick() {
        startANewChatRoom({ dispatch, loggedUsername, ...secondUserDetails });
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
                (!secondUserDetails.secondUsername) || isCheckingLoginStatus || !isSomeoneLoggedIn ?
                    <LandingPageDesign isCheckingLoginStatus={isCheckingLoginStatus} />
                    :
                    <PurpleGradientContainer childrenClassName="homeContainer">
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

                            <div id="chatContent" className="chatContent">
                                y yo
                            </div>
                            <div
                                className="chatActionBox"
                                style={{ "--actionBoxHeight": CHAT_ACTION_BOX_HEIGHT }}
                            >
                                <ActionButton
                                    dark={false}
                                    // showLoader={isLoggingUser}
                                    buttonText="Start Chat"
                                    onClick={handleStartBtnClick}
                                />
                            </div>
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
        userDetails: state.userDetails,
    }
}

export default connect(mapStateToProps, undefined)(NewChat);