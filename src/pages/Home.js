import React, { lazy, Suspense } from 'react';
import { connect } from 'react-redux';

import LoadingAnimation from "../components/LoadingAnimation";
import { redirectToLoginPage } from "../utils";

const VerifyPasscode = lazy(() => import('../components/VerifyPasscode'));
const HomePageContent = lazy(() => import('../components/Home/HomePageContent'));

function Home({
    isPasscodeVerified,
    isSomeoneLoggedIn,
    history,
}) {
    isPasscodeVerified = true;

    return (
        <Suspense fallback={
            <LoadingAnimation dark loading />
        }>
            {!isSomeoneLoggedIn ? redirectToLoginPage() : null}

            {
                isPasscodeVerified ?
                    <HomePageContent history={history} />
                    :
                    <VerifyPasscode />
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

export default connect(mapStateToProps, undefined)(Home);