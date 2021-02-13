import React, { useEffect } from "react";
import { connect } from 'react-redux';

import LoadingAnimation from "../components/LoadingAnimation";
import ChatPageContent from "../components/ChatPageContent";

import { getChatRoomDetailsAction } from "../redux/actions/index";
import { redirectToLoginPage } from "../utils";

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
        if (isSomeoneLoggedIn) {
            dispatch(getChatRoomDetailsAction(chatRoomId));
        }
    }, [isSomeoneLoggedIn]);

    return (
        <>
            {redirectToLoginPage(isCheckingLoginStatus, isSomeoneLoggedIn)}

            {
                isGettingChatRoomDetails || !isChatRoomDetailsFetched ?
                    <LoadingAnimation loading />
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