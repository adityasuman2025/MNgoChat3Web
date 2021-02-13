import React, { useEffect } from "react";
import cx from "classnames";

export default function SnackBar({
    open,
    duration = 5000,
    type = "error",
    msg,
    boxclassName,
    textclassName,
    handleClose,
}) {
    useEffect(() => {
        setTimeout(function() {
            console.log("hiding snack bar in 5 s");
            handleClose();
        }, duration);
    }, [msg])

    function renderTypeStyle(type) {
        if (type === "error") {
            return "errorBox";
        } else if (type === "success") {
            return "successBox";
        } else if (type === "info") {
            return "infoBox";
        }

        return "";
    }

    return (
        open ?
            <div className="snackBarContainer">
                <div className={cx("snackBarContent", renderTypeStyle(type), boxclassName)}>
                    <span className={cx("snackBarText", textclassName)}>{msg}</span>
                </div>
            </div>
            : null
    )
}