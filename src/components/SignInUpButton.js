import React from 'react';

export default function SignInUpButton({
    otherText,
    buttonText = "Button",
    onClick,
}) {
    return (
        <div className="signInUpBtnContainer">
            {
                otherText ?
                    <span className="signInUpText">{otherText}</span>
                    : null
            }

            <span className="signInUpBtn" onClick={onClick} >{buttonText}</span>
        </div>
    );
}