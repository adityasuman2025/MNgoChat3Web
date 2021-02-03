import React from 'react';

import warningImg from "../images/warning.png";

export default function OfflineModal() {
    return (
        <div className="warningModal">
            <div className="imageViewerBg" />
            <img src={warningImg} className="imageViewerImg" />
            <br />
            <div className="redTitle">You are not connected to internet</div>
        </div>
    );
}