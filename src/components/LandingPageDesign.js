import React from "react";

import LoadingAnimation from "../components/LoadingAnimation";
import PurpleGradientContainer from "../components/PurpleGradientContainer";
import GreyGradientContainer from "../components/GreyGradientContainer";
import { getLogoImg } from "../utils";

export default function LandingPageDesign({
    isLoading,
}) {
    return (
        <PurpleGradientContainer childrenClassName="flexCenter">
            <GreyGradientContainer width="350px" height="350px">
                <img
                    className="logoImg"
                    alt="logoImg"
                    src={getLogoImg()}
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
                <LoadingAnimation dark loading={isLoading} />
            </GreyGradientContainer>
        </PurpleGradientContainer>
    )
}