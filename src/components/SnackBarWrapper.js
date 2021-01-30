import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import SnackBar from "./SnackBar";

function SnackBarWrapper({
    snackBarCount,
    snackBarMsg,
    snackBarType,

    loginUserError,

    checkLoginStatusError,



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
        if (loginUserError) {
            makeSnackBar(loginUserError);
        }
    }, [loginUserError]);

    useEffect(() => {
        if (checkLoginStatusError) {
            makeSnackBar(checkLoginStatusError);
        }
    }, [checkLoginStatusError]);

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

        loginUserError: state.loginUserError,

        checkLoginStatusError: state.checkLoginStatusError,
    }
}

export default connect(mapStateToProps, undefined)(SnackBarWrapper);