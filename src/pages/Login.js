import React, { useState } from 'react';
import { connect } from 'react-redux';

import logoImg from "../images/logo.png";
import ActionButton from "../components/ActionButton";
import SignInUpButton from "../components/SignInUpButton";

import { PROJECT_NAME } from "../constants";
import { showSnackBarAction, loginUserAction } from "../redux/actions/index";
import { redirectToHomeOrLoginPage } from "../utils";

function Login({
    isLoggingUser,
    isCheckingLoginStatus,
    isSomeoneLoggedIn,
    history,
    dispatch,
}) {
    console.log("on login");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    function handleLoginBtnClick(e) {
        e.preventDefault();

        if (isLoggingUser) {
            return;
        }

        if (username !== "" && password !== "") {
            dispatch(loginUserAction(username, password));
        } else {
            dispatch(showSnackBarAction("Please fill all the input fields"));
        }
    }

    function handleSignUpBtnClick() {
        history.push("/register");
    }

    return (
        <>
            {redirectToHomeOrLoginPage(isCheckingLoginStatus, isSomeoneLoggedIn)}

            <img
                className="logoImg"
                alt="logoImg"
                src={logoImg}
            />
            <div className="logoTitle">{PROJECT_NAME}</div>

            <form className="formContainer" onSubmit={handleLoginBtnClick}>
                <input
                    type="text"
                    className="formInputField"
                    placeholder="Username"
                    autoFocus
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <input
                    type="password"
                    className="formInputField"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <ActionButton
                    dark={false}
                    showLoader={isLoggingUser}
                    buttonText="Login"
                    onClick={handleLoginBtnClick}
                />
            </form>

            <SignInUpButton
                otherText="Don't have an account yet?"
                buttonText="Signup"
                onClick={handleSignUpBtnClick}
            />
        </>
    );
}

const mapStateToProps = (state) => {
    return {
        isLoggingUser: state.isLoggingUser,
        isCheckingLoginStatus: state.isCheckingLoginStatus,
        isSomeoneLoggedIn: state.isSomeoneLoggedIn,
    }
}

export default connect(mapStateToProps, undefined)(Login);