import React, { useEffect } from "react";
import { connect } from 'react-redux';
import { Redirect } from "react-router-dom";

import LandingPageDesign from "../components/LandingPageDesign";
import ChatPageContent from "../components/ChatPageContent";

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
    useEffect(() => {
        dispatch(checkLoginStatusAction());
    }, []);

    //to get chat room details
    useEffect(() => {
        if (isSomeoneLoggedIn) {
            // dispatch(getChatRoomDetailsAction(chatRoomId));
        }
    }, [isSomeoneLoggedIn]);

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
                    "nice"
                // <ChatPageContent dispatch={dispatch} chatRoomId={chatRoomId} />
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