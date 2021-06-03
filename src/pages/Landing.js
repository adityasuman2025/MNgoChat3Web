import React from "react";
import { connect } from 'react-redux';

import { redirectToHomeOrLoginPage } from "../utils";

function Landing({
    isSomeoneLoggedIn,
}) {
    return (
        <>
            {redirectToHomeOrLoginPage(isSomeoneLoggedIn)}
        </>
    )
}

const mapStateToProps = (state) => {
    return {
        isSomeoneLoggedIn: state.isSomeoneLoggedIn,
    }
}

export default connect(mapStateToProps, undefined)(Landing);