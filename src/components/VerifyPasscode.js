import React, { useState } from 'react';
import { connect } from 'react-redux';

import ActionButton from "./ActionButton";

import { LOGGED_USER_TOKEN_COOKIE_NAME } from "../constants";
import { showSnackBarAction, verifyPasscodeAction } from "../redux/actions/index";
import { getCookieValue } from "../utils";

function VerifyPassCode({
    isVerifyingPasscode,
    isPasscodeVerified,
    dispatch,
}) {
    const [passcode, setPasscode] = useState("");

    function handleVerifyBtnClick(e) {
        e.preventDefault();

        if (isVerifyingPasscode) {
            return;
        }

        const loggedUserToken = getCookieValue(LOGGED_USER_TOKEN_COOKIE_NAME);
        if (passcode !== "" && loggedUserToken) {
            dispatch(verifyPasscodeAction(loggedUserToken, passcode));
        } else {
            dispatch(showSnackBarAction("Please enter passcode"));
        }
    }

    return (
        <form className="verifyPasscodeContainer" onSubmit={handleVerifyBtnClick}>
            <div className="darkTitle">Verify Passcode</div>
            <input
                type="password"
                className="formInputField"
                placeholder="Enter Passcode"
                autoFocus
                maxLength={4}
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
            />

            <ActionButton
                dark={true}
                showLoader={isVerifyingPasscode}
                buttonText="Verify"
                onClick={handleVerifyBtnClick}
            />
        </form>
    );
}

const mapStateToProps = (state) => {
    return {
        isVerifyingPasscode: state.isVerifyingPasscode,
        isPasscodeVerified: state.isPasscodeVerified,
    }
}

export default connect(mapStateToProps, undefined)(VerifyPassCode);