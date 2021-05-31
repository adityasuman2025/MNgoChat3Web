import React from 'react';
import { connect } from 'react-redux';

import VerifyPasscode from "../components/VerifyPasscode";
import HomePageContent from "../components/Home/HomePageContent";

import { redirectToLoginPage } from "../utils";

function Home({
    isPasscodeVerified,
    isSomeoneLoggedIn,
    history,
}) {
    isPasscodeVerified = true;

    return (
        <>
            {!isSomeoneLoggedIn ? redirectToLoginPage() : null}

            {
                isPasscodeVerified ?
                    <HomePageContent history={history} />
                    :
                    <VerifyPasscode />
            }
        </>
    );
}

const mapStateToProps = (state) => {
    return {
        isPasscodeVerified: state.isPasscodeVerified,
        isSomeoneLoggedIn: state.isSomeoneLoggedIn,
    }
}

export default connect(mapStateToProps, undefined)(Home);