import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect } from "react-router-dom";

import allUsers from "../images/allUsers.png";
import allFrnds from "../images/allFrnds.png";
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
                            true ?
                                <div className="homeContainer">
                                    <div
                                        className="homeContentContainer"
                                        style={{
                                            "--bottomNavHeight": "50px",
                                            "--bottomNavMarginBottom": "0px",
                                        }}
                                    >
                                        all good
                                    </div>
                                    <div
                                        className="homeBottomNavContainer"
                                        style={{
                                            "--bottomNavHeight": "50px",
                                            "--bottomNavMarginBottom": "0px",
                                        }}
                                    >
                                        <img
                                            className="bottomTabIcons"
                                            alt="allFrnds"
                                            src={allFrnds}
                                        />

                                        <img
                                            className="bottomTabIcons"
                                            alt="allUsers"
                                            src={allUsers}
                                        />
                                    </div>
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