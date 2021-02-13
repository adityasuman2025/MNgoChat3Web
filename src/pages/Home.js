import React from 'react';
import { connect } from 'react-redux';

import VerifyPasscode from "../components/VerifyPasscode";
import HomePageContent from "../components/HomePageContent";
import LoadingAnimation from "../components/LoadingAnimation";

import { redirectToLoginPage } from "../utils";

function Home({
    isPasscodeVerified,
    isCheckingLoginStatus,
    isSomeoneLoggedIn,
    history,
}) {
    console.log("on home")
    isPasscodeVerified = true;

    return (
        <>
            {redirectToLoginPage(isCheckingLoginStatus, isSomeoneLoggedIn)}

            {
                isSomeoneLoggedIn ?
                    isPasscodeVerified ?
                        <HomePageContent history={history} />
                        :
                        <VerifyPasscode />
                    :
                    <LoadingAnimation loading />
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