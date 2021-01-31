import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import SnackBar from "./SnackBar";

function SnackBarWrapper({
    snackBarCount,
    snackBarMsg,
    snackBarType,

    checkLoginStatusError,

    loginUserError,

    isUserRegistered,
    registerUserError,

    verifyPasscodeError,

    getUserAllChatsError,

    children,
}) {
    const [snackBarVisible, setSnackBarVisible] = useState(false);
    const [snackBarMsgState, setSnackBarMsgState] = useState("");
    const [snackBarTypeState, setSnackBarTypeState] = useState("success")

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




    function makeSnackBar(msg, type) {
        setSnackBarMsgState(msg);
        setSnackBarTypeState(type);
        setSnackBarVisible(true);
    }

    function handleSnackBarClose() {
        setSnackBarVisible(false);
    }

    return (
        <>
            {children}
            <SnackBar
                open={snackBarVisible}
                msg={snackBarMsgState}
                type={snackBarTypeState}
                handleClose={handleSnackBarClose}
            />
        </>
    )
}


const mapStateToProps = (state) => {
    return {
        snackBarCount: state.snackBarCount,
        snackBarMsg: state.snackBarMsg,
        snackBarType: state.snackBarType,

        checkLoginStatusError: state.checkLoginStatusError,

        loginUserError: state.loginUserError,

        isUserRegistered: state.isUserRegistered,
        registerUserError: state.registerUserError,

        verifyPasscodeError: state.verifyPasscodeError,

        getUserAllChatsError: state.getUserAllChatsError,
    }
}

export default connect(mapStateToProps, undefined)(SnackBarWrapper);