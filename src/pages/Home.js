import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect } from "react-router-dom";

import LandingPageDesign from "../components/LandingPageDesign";
import PurpleGradientContainer from "../components/PurpleGradientContainer";
import VerifyPasscode from "../components/VerifyPasscode";

import {
    showSnackBarAction,
    checkLoginStatusAction,
} from "../redux/actions/index";

function Home({
    isPasscodeVerified,
    isCheckingLoginStatus,
    isSomeoneLoggedIn,
    history,
    dispatch,
}) {
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
                    <PurpleGradientContainer childrenClassName="flexCenter">
                        {
                            isPasscodeVerified ?
                                <div>
                                    all good
                                </div>
                                :
                                <VerifyPasscode />
                        }
                    </PurpleGradientContainer>
            }
        </>
    );
}

const mapStateToProps = (state) => {
    return {
        isPasscodeVerified: state.isPasscodeVerified,
        isCheckingLoginStatus: state.isCheckingLoginStatus,
        isSomeoneLoggedIn: state.isSomeoneLoggedIn,
    }
}

export default connect(mapStateToProps, undefined)(Home);