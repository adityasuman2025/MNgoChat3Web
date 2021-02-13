import React from "react";
import { connect } from 'react-redux';

import { redirectToHomeOrLoginPage } from "../utils";

function Landing({
    isCheckingLoginStatus,
    isSomeoneLoggedIn,
}) {
    return (
        <>
            {redirectToHomeOrLoginPage(isCheckingLoginStatus, isSomeoneLoggedIn)}
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