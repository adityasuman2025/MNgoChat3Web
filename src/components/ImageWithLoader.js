import React, { useState } from 'react';
import cx from "classnames";
import LoadingAnimation from "./LoadingAnimation";

export default function ImageWithLoader({
    className,
    loaderClassName,
    src,
    onClick,
}) {
    const [showLoader, setShowLoader] = useState(true);
    const [isImageVisible, setIsImageVisible] = useState(false);

    function displayImage() {
        setShowLoader(false);
        setIsImageVisible(true);
    }

    if (!src) return <></>;
    return (
        <div className={cx("imageWithLoaderContainer", className)} >
            <LoadingAnimation dark loading={showLoader} loaderClassName={loaderClassName} />
            <img src={src} className="imageWithLoaderImg" style={{ display: isImageVisible ? "block" : "none" }} onLoad={displayImage} onClick={onClick} onError={() => setShowLoader(false)} />
        </div>
    );
}