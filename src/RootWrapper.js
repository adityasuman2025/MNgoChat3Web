import React, { useState, useEffect, lazy, Suspense } from 'react';
import { connect } from 'react-redux';

import LoadingAnimation from "./components/LoadingAnimation";
import { checkLoginStatusAction } from "./redux/actions/index";

const SnackBar = lazy(() => import('./components/SnackBar'));
const OfflineModal = lazy(() => import('./components/OfflineModal'));
const PurpleGradientContainer = lazy(() => import('./components/PurpleGradientContainer'));
const LandingPageDesign = lazy(() => import('./components/LandingPageDesign'));

/* eslint-disable react-hooks/exhaustive-deps */
function RootWrapper({
    isCheckingLoginStatus,

    snackBarCount,
    snackBarMsg,
    snackBarType,

    checkLoginStatusError,
    loginUserError,

    isUserRegistered,
    registerUserError,

    verifyPasscodeError,
    getUserAllChatsError,
    getAllUsersError,
    startNewChatRoomError,
    uploadImageError,

    children,

    dispatch,
}) {
    const [showOfflineWarning, setShowOffLineWarning] = useState(false);
    const [snackBarVisible, setSnackBarVisible] = useState(false);
    const [snackBarMsgState, setSnackBarMsgState] = useState("");
    const [snackBarTypeState, setSnackBarTypeState] = useState("success")

    useEffect(() => {
        window.addEventListener('offline', function(e) {
            setShowOffLineWarning(true);
        });

        window.addEventListener('online', function(e) {
            setShowOffLineWarning(false);
        });
    }, []);

    useEffect(() => {
        dispatch(checkLoginStatusAction());
    }, []);

    useEffect(() => {
        if (snackBarMsg) {
            makeSnackBar(snackBarMsg, snackBarType);
        }
    }, [snackBarCount]);

    useEffect(() => {
        if (checkLoginStatusError) {
            makeSnackBar(checkLoginStatusError);
        }
    }, [checkLoginStatusError]);

    useEffect(() => {
        if (loginUserError) {
            makeSnackBar(loginUserError);
        }
    }, [loginUserError]);

    useEffect(() => {
        if (registerUserError) {
            makeSnackBar(registerUserError);
        }
    }, [registerUserError]);

    useEffect(() => {
        if (isUserRegistered) {
            makeSnackBar("Successfully registered. Please login to continue", "success");
        }
    }, [isUserRegistered]);

    useEffect(() => {
        if (verifyPasscodeError) {
            makeSnackBar(verifyPasscodeError);
        }
    }, [verifyPasscodeError]);

    useEffect(() => {
        if (getUserAllChatsError) {
            makeSnackBar(getUserAllChatsError);
        }
    }, [getUserAllChatsError]);

    useEffect(() => {
        if (getUserAllChatsError) {
            makeSnackBar(getUserAllChatsError);
        }
    }, [getUserAllChatsError]);

    useEffect(() => {
        if (getAllUsersError) {
            makeSnackBar(getAllUsersError);
        }
    }, [getAllUsersError]);

    useEffect(() => {
        if (startNewChatRoomError) {
            makeSnackBar(startNewChatRoomError);
        }
    }, [startNewChatRoomError]);

    useEffect(() => {
        if (uploadImageError) {
            makeSnackBar(uploadImageError);
        }
    }, [uploadImageError]);

    function makeSnackBar(msg, type) {
        setSnackBarMsgState(msg);
        setSnackBarTypeState(type);
        setSnackBarVisible(true);
    }

    function handleSnackBarClose() {
        setSnackBarVisible(false);
    }

    return (
        <Suspense fallback={
            <LoadingAnimation dark loading />
        }>
            {
                showOfflineWarning ?
                    <OfflineModal />
                    : null
            }

            {
                isCheckingLoginStatus ?
                    <LandingPageDesign isLoading={true} />
                    :
                    <PurpleGradientContainer childrenClassName="flexCenter">
                        {children}
                    </PurpleGradientContainer>
            }

            {
                snackBarVisible ?
                    <SnackBar
                        open={snackBarVisible}
                        msg={snackBarMsgState}
                        type={snackBarTypeState}
                        handleClose={handleSnackBarClose}
                    />
                    : null
            }
        </Suspense>
    )
}

const mapStateToProps = (state) => {
    return {
        isCheckingLoginStatus: state.isCheckingLoginStatus,

        snackBarCount: state.snackBarCount,
        snackBarMsg: state.snackBarMsg,
        snackBarType: state.snackBarType,

        checkLoginStatusError: state.checkLoginStatusError,
        loginUserError: state.loginUserError,

        isUserRegistered: state.isUserRegistered,
        registerUserError: state.registerUserError,

        verifyPasscodeError: state.verifyPasscodeError,
        getUserAllChatsError: state.getUserAllChatsError,
        getAllUsersError: state.getAllUsersError,
        startNewChatRoomError: state.startNewChatRoomError,
        uploadImageError: state.uploadImageError,
    }
}

export default connect(mapStateToProps, undefined)(RootWrapper);