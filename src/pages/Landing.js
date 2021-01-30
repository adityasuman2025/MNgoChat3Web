import React, { useEffect } from "react";
import { connect } from 'react-redux';
import { Redirect } from "react-router-dom";

import LandingPageDesign from "../components/LandingPageDesign";

import { checkLoginStatusAction } from "../redux/actions/index";

function Landing({
    isCheckingLoginStatus,
    isSomeoneLoggedIn,
    dispatch,
}) {
    useEffect(() => {
        dispatch(checkLoginStatusAction());
    }, []);

    function redirectToHomeOrLoginPage() {
        if (!isCheckingLoginStatus) {
            if (isSomeoneLoggedIn) {
                return <Redirect to="/home" />;
            } else {
                return <Redirect to="/login" />;
            }
        }
    }

    return (
        <>
            {redirectToHomeOrLoginPage()}

            <LandingPageDesign isCheckingLoginStatus={isCheckingLoginStatus} />
        </>
    )
}

const mapStateToProps = (state) => {
    return {
        isCheckingLoginStatus: state.isCheckingLoginStatus,
        isSomeoneLoggedIn: state.isSomeoneLoggedIn,
    }
}

export default connect(mapStateToProps, undefined)(Landing);