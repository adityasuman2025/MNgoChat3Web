import React, { useState, useEffect } from "react";
import { connect } from 'react-redux';

import LoadingAnimation from "../components/LoadingAnimation";
import ChatPageContent from "../components/Chat/ChatPageContent";
import { redirectToLoginPage, decryptText } from "../utils";

import { showSnackBarAction } from "../redux/actions/index";

function Chat({
    isSomeoneLoggedIn,
    dispatch,
}) {
    const [isLoading, setIsLoading] = useState(true);
    const [selectedUserDetails, setSelectedUserDetails] = useState({});

    useEffect(() => {
        try {
            const fullUrl = (window.location.href).split("chat/");
            const encryptedSelectedUserDetails = fullUrl[1];
            const urlUserDetails = JSON.parse(decryptText(encryptedSelectedUserDetails));
            if (urlUserDetails.chatRoomId && urlUserDetails.token && urlUserDetails.name) {
                setSelectedUserDetails(urlUserDetails);
                setIsLoading(false);
            } else {
                dispatch(showSnackBarAction("Invalid user selected"));
            }
        } catch (e) {
            dispatch(showSnackBarAction("Invalid user selected"));
        }
    }, []);

    return (
        <>
            {!isSomeoneLoggedIn ? redirectToLoginPage() : null}

            {
                isLoading ? <LoadingAnimation dark loading />
                    :
                    <ChatPageContent
                        chatRoomId={selectedUserDetails.chatRoomId}
                        selectedUserName={selectedUserDetails.name}
                        selectedUserToken={selectedUserDetails.token}
                        selectedUserProfileImg={selectedUserDetails.profileImg}
                    />
            }
        </>
    );
}

const mapStateToProps = (state) => {
    return {
        isSomeoneLoggedIn: state.isSomeoneLoggedIn,
    }
}

export default connect(mapStateToProps, undefined)(Chat);