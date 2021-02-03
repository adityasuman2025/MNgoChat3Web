import React, { useEffect } from "react";
import { connect } from 'react-redux';
import { Redirect } from "react-router-dom";

import userIcon from "../images/user.png";
import LandingPageDesign from "../components/LandingPageDesign";
import PurpleGradientContainer from "../components/PurpleGradientContainer";
import ActionButton from "../components/ActionButton";

import { CHAT_ACTION_BOX_HEIGHT } from "../constants";
import {
    checkLoginStatusAction,
} from "../redux/actions/index";

function NewChat({
    isCheckingLoginStatus,
    isSomeoneLoggedIn,
    match: {
        params: {
            secondUserToken,
        } = {}
    } = {},
    dispatch,
}) {
    console.log("secondUserToken", secondUserToken)
    useEffect(() => {
        dispatch(checkLoginStatusAction());
    }, []);

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
                isCheckingLoginStatus ?
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
                                    <div className="lightTitle">{secondUserToken}</div>
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
                                // onClick={handleLoginBtnClick}
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
    }
}

export default connect(mapStateToProps, undefined)(NewChat);