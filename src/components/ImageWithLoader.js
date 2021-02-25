import React, { useState } from 'react';

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
        <>
            <LoadingAnimation loading={showLoader} loaderClassName={loaderClassName} />
            <img src={src} className={className} style={{ display: isImageVisible ? "block" : "none" }} onLoad={displayImage} onClick={onClick} onError={() => setShowLoader(false)} />
        </>
    );
}