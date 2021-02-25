import React, { useState } from 'react';

import closeIcon from "../images/close.png";
import LoadingAnimation from "./LoadingAnimation";

export default function ImageViewer({
    src,
    onClose,
}) {
    const [showLoader, setShowLoader] = useState(true);

    if (!src) return;
    return (
        <div className="imageViewer">
            <div className="imageViewerBg" onClick={onClose} />
            <img src={closeIcon} className="imageViewerCloseIcon" onClick={onClose} />
            <LoadingAnimation loading={showLoader} dark />
            <img src={src} className="imageViewerImg" onLoad={() => setShowLoader(false)} onError={() => setShowLoader(false)} />
        </div>
    );
}