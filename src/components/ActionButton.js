import React from 'react';
import cx from "classnames";

import LoadingAnimation from "./LoadingAnimation";

export default function ActionButton({
    dark,
    className,
    textclassName,
    showLoader,
    buttonText = "Button",
    onClick,
}) {
    return (
        <button
            className={cx("actionBtnContainer", { "darkActionBtnContainer": dark }, className)}
            onClick={!showLoader ? onClick : null}
        >
            {
                showLoader ?
                    <LoadingAnimation dark={!dark} loading={showLoader} />
                    :
                    <div className={cx("actionBtnText", { "darkActionBtnText": dark }, textclassName)}>
                        {buttonText}
                    </div>
            }
        </button>
    );
}