import React from "react";

import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function SnackBar({
    open,
    duration,
    type,
    msg,
    handleClose,
}) {
    return (
        <Snackbar
            open={open}
            autoHideDuration={duration || 6000}
            onClose={handleClose}
        >
            <Alert onClose={handleClose} severity={type || "error"}>{msg}</Alert>
        </Snackbar>
    )
}