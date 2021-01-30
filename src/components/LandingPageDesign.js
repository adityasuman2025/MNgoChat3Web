import React from "react";

import logoImg from "../images/logo.png";
import LoadingAnimation from "../components/LoadingAnimation";
import PurpleGradientContainer from "../components/PurpleGradientContainer";
import GreyGradientContainer from "../components/GreyGradientContainer";

export default function LandingPageDesign({
    isCheckingLoginStatus,
}) {
    return (
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
                <LoadingAnimation dark={true} loading={isCheckingLoginStatus} />
            </GreyGradientContainer>
        </PurpleGradientContainer>
    )
}