import React from "react";
import cx from "classnames";

import { GRADIENT_GREY_LIGHT, GRADIENT_GREY_DARK } from "../constants";

function GreyGradientContainer({
    className,
    width = "200px",
    height = "200px",
    children,
}) {
    return (
        <div
            className={cx("greyGradientContainer", className)}
            style={{
                "--first": GRADIENT_GREY_LIGHT,
                "--second": GRADIENT_GREY_DARK,
                "--width": width,
                "--height": height,
            }}
        >
            {children}
        </div>
    )
}

export default GreyGradientContainer;