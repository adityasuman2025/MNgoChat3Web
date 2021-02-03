import React, { useEffect } from "react";
import { connect } from 'react-redux';
import { Redirect } from "react-router-dom";

import LandingPageDesign from "../components/LandingPageDesign";
import ChatPageContent from "../components/ChatPageContent";

import {
    checkLoginStatusAction,
    getChatRoomDetailsAction
} from "../redux/actions/index";

function Chat({
    isCheckingLoginStatus,
    isSomeoneLoggedIn,
    isGettingChatRoomDetails,
    isChatRoomDetailsFetched,
    match: {
        params: {
            chatRoomId,
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
            dispatch(getChatRoomDetailsAction(chatRoomId));
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
                isCheckingLoginStatus || (isGettingChatRoomDetails || !isChatRoomDetailsFetched) ?
                    <LandingPageDesign isCheckingLoginStatus={isCheckingLoginStatus || isGettingChatRoomDetails} />
                    :
                    <ChatPageContent dispatch={dispatch} chatRoomId={chatRoomId} />
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
    }
}

export default connect(mapStateToProps, undefined)(Chat);