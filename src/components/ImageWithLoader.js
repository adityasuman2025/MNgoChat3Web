import React, { useState } from 'react';

import LoadingAnimation from "./LoadingAnimation";

export default function ImageWithLoader({
    className,
    src,
    onClick,
}) {
    const [showLoader, setShowLoader] = useState(true);

    if (!src) return;
    return (
        <>
            <LoadingAnimation loading={showLoader} />
            <img src={src} className={className} onLoad={() => setShowLoader(false)} onClick={onClick} onError={() => setShowLoader(false)} />
        </>
    );
}