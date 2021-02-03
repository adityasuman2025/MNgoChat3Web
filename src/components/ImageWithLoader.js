import React, { useState } from 'react';

import LoadingAnimation from "./LoadingAnimation";

export default function ImageWithLoader({
    src,
    onClick,
}) {
    const [showLoader, setShowLoader] = useState(true);

    if (!src) return;
    return (
        <>
            <LoadingAnimation loading={showLoader} />
            <img src={src} className="imageViewerImg" onLoad={() => setShowLoader(false)} onClick={onClick} />
        </>
    );
}