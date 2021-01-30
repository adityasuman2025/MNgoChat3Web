import React from "react";
import cx from "classnames";

import { GRADIENT_PURPLE_LIGHT, GRADIENT_PURPLE_DARK, } from "../constants";

function PurpleGradientContainer({
    childrenClassName,
    children,
}) {
    return (
        <div
            className="purpleGradientContainer"
            style={{ "--first": GRADIENT_PURPLE_LIGHT, "--second": GRADIENT_PURPLE_DARK }}
        >
            <div className={cx("purpleContainerChildren", childrenClassName)}>
                {children}
            </div>
        </div>
    )
}

export default PurpleGradientContainer;