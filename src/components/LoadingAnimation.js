import React from "react";
import cx from "classnames";

export default function LoadingAnimation({
    dark,
    loading,
    className,
    loaderClassName,
}) {
    return loading ?
        <center className={className}>
            <div className={cx("loadingAnimation", { ["darkLoader"]: dark }, loaderClassName)} />
        </center>
        : null;
}