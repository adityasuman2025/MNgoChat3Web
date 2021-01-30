import React, { useEffect } from "react";
import { connect } from 'react-redux';
import { Redirect } from "react-router-dom";

import logoImg from "../images/logo.png";
import LoadingAnimation from "../components/LoadingAnimation";
import PurpleGradientContainer from "../components/PurpleGradientContainer";
import GreyGradientContainer from "../components/GreyGradientContainer";

import { checkLoginStatusAction } from "../redux/actions/index";

function Landing({
    isCheckingLoginStatus,
    isSomeoneLoggedIn,
    dispatch,
}) {
    useEffect(() => {
        dispatch(checkLoginStatusAction());
    }, []);

    return (
        <>
            {
                !isCheckingLoginStatus && isSomeoneLoggedIn ? <Redirect to="/home" /> : <Redirect to="/login" />
            }

            <PurpleGradientContainer childrenClassName="flexCenter">
                <GreyGradientContainer width="350px" height="350px">
                    <img
                        className="logoImg"
                        alt="logoImg"
                        src={logoImg}
                    />
                </GreyGradientContainer>
                <GreyGradientContainer
                    className="greyGradientContainer2"
                    width="220px"
                    height="220px"
                />
                <GreyGradientContainer
                    className="greyGradientContainer3"
                    width="150px"
                    height="150px"
                />
                <GreyGradientContainer
                    className="greyGradientContainer4"
                    width="100px"
                    height="100px"
                >
                    <LoadingAnimation dark={true} loading={true} />
                </GreyGradientContainer>
            </PurpleGradientContainer>
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