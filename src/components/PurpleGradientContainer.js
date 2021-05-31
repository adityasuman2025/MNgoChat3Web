import React from "react";
import cx from "classnames";

import { THEME_GRADIENT } from "../constants";

function PurpleGradientContainer({
    childrenClassName,
    children,
}) {
    return (
        <div
            className="purpleGradientContainer"
            style={{ backgroundImage: THEME_GRADIENT }}
        >
            <div className={cx("purpleContainerChildren", childrenClassName)}>
                {children}
            </div>
        </div>
    )
}

export default PurpleGradientContainer;