import React from "react";
import cx from "classnames";

import { GREY_GRADIENT } from "../constants";

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
                background: GREY_GRADIENT,
                "--width": width,
                "--height": height,
            }}
        >
            {children}
        </div>
    )
}

export default GreyGradientContainer;