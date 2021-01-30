import React from "react";

export default function LoadingAnimation({
    loading
}) {
    return loading ? (
        <center>
            <img
                alt="loading"
                className="loadingAnimation"
                src={require("../images/loader.gif")}
            />
        </center>
    ) : null;
}