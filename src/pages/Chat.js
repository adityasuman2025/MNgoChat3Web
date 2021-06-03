import React, { useState, useEffect, lazy, Suspense } from "react";
import { connect } from 'react-redux';

import LoadingAnimation from "../components/LoadingAnimation";
import { redirectToLoginPage } from "../utils";
import { decryptText } from "../encryptionUtil";
import { showSnackBarAction } from "../redux/actions/index";

const VerifyPasscode = lazy(() => import('../components/VerifyPasscode'));
const ChatPageContent = lazy(() => import('../components/Chat/ChatPageContent'));

function Chat({
    isPasscodeVerified,
    isSomeoneLoggedIn,
    dispatch,
}) {
    isPasscodeVerified = true;

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
        <Suspense fallback={
            <LoadingAnimation dark loading />
        }>
            {!isSomeoneLoggedIn ? redirectToLoginPage() : null}

            {
                isLoading ? <LoadingAnimation dark loading />
                    :
                    isPasscodeVerified ?
                        <ChatPageContent
                            chatRoomId={selectedUserDetails.chatRoomId}
                            selectedUserName={selectedUserDetails.name}
                            selectedUserToken={selectedUserDetails.token}
                            selectedUserProfileImg={selectedUserDetails.profileImg}
                        />
                        : <VerifyPasscode />
            }
        </Suspense>
    );
}

const mapStateToProps = (state) => {
    return {
        isPasscodeVerified: state.isPasscodeVerified,
        isSomeoneLoggedIn: state.isSomeoneLoggedIn,
    }
}

export default connect(mapStateToProps, undefined)(Chat);