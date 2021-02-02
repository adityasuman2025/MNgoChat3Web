import React from "react";
import cx from "classnames";

import loaderImg from '../images/loader.gif';

export default function LoadingAnimation({
    dark,
    loading,
    className,
}) {
    return loading ? (
        <center className={className}>
            <img
                alt="loading"
                className={cx("loadingAnimation", { ["darkLoader"]: dark })}
                src={loaderImg}
            />
        </center>
    ) : null;
}