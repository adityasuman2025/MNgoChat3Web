import React from "react";
import loaderImg from '../images/loader.gif';

export default function LoadingAnimation({
    loading
}) {
    return loading ? (
        <center>
            <img
                alt="loading"
                className="loadingAnimation"
                src={loaderImg}
            />
        </center>
    ) : null;
}