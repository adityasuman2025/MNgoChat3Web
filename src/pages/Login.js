import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect } from "react-router-dom";

import logoImg from "../images/logo.png";
import LandingPageDesign from "../components/LandingPageDesign";
import PurpleGradientContainer from "../components/PurpleGradientContainer";
import ActionButton from "../components/ActionButton";
import SignInUpButton from "../components/SignInUpButton";

import { PROJECT_NAME } from "../constants";
import {
    showSnackBarAction,
    checkLoginStatusAction,
    loginUserAction
} from "../redux/actions/index";

function Login({
    isLoggingUser,
    isCheckingLoginStatus,
    isSomeoneLoggedIn,
    history,
    dispatch,
}) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        dispatch(checkLoginStatusAction());
    }, []);

    function handleLoginBtnClick(e) {
        e.preventDefault();

        if (!isLoggingUser) {
            if (username !== "" && password !== "") {
                dispatch(loginUserAction(username, password));
            } else {
                dispatch(showSnackBarAction("Please enter all input fields"));
            }
        }
    }

    function handleSignUpBtnClick() {
        history.push("/register");
    }

    function redirectToHomeOrLoginPage() {
        if (!isCheckingLoginStatus) {
            if (isSomeoneLoggedIn) {
                return <Redirect to="/home" />;
            } else {
                return <Redirect to="/login" />;
            }
        }
    }

    return (
        <>
            {redirectToHomeOrLoginPage()}

            {
                isCheckingLoginStatus ?
                    <LandingPageDesign isCheckingLoginStatus={isCheckingLoginStatus} />
                    :
                    <PurpleGradientContainer childrenClassName="flexCenter">
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
                    </PurpleGradientContainer>
            }
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