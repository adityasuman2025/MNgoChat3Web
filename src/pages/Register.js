import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Redirect } from "react-router-dom";

import logoImg from "../images/logo.png";
import PurpleGradientContainer from "../components/PurpleGradientContainer";
import ActionButton from "../components/ActionButton";

import { PROJECT_NAME } from "../constants";
import {
    validateUsername,
    validateName,
    validateEmail,
    validateNumber,
} from "../utils";
import { showSnackBarAction, registerUserAction } from "../redux/actions/index";

function Register({
    isRegisteringUser,
    isUserRegistered,
    dispatch,
}) {
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confPassword, setConfPassword] = useState("");
    const [passcode, setPasscode] = useState("");
    const [confPasscode, setConfPasscode] = useState("");

    const [redirectToLoginPage, setRedirectToLoginPage] = useState(false);
    const [btnClicked, setBtnClicked] = useState(false);

    useEffect(() => {
        if (isUserRegistered && btnClicked) {
            setRedirectToLoginPage(true);
        }
    }, [isUserRegistered]);

    function handleRegisterBtnClick(e) {
        e.preventDefault();

        if (isRegisteringUser) {
            return;
        }

        if (username !== "" && name !== "" && email !== "" && password !== "" && confPassword !== "" && passcode !== "" && confPasscode !== "") {
            if (!validateUsername(username)) {
                dispatch(showSnackBarAction("Username cannot contain symbol and spaces"));
                return;
            }
            if (!validateName(name)) {
                dispatch(showSnackBarAction("Name cannot contain symbol and spaces"));
                return;
            }
            if (!validateEmail(email)) {
                dispatch(showSnackBarAction("Invalid Email id format"));
                return;
            }
            if (password !== confPassword) {
                dispatch(showSnackBarAction("Password do not match"));
                return;
            }
            if (!validateNumber(passcode)) {
                dispatch(showSnackBarAction("Passcode must be a number"));
                return;
            }
            if (passcode.length !== 4) {
                dispatch(showSnackBarAction("Passcode must be 4 digits long"));
                return;
            }
            if (passcode !== confPasscode) {
                dispatch(showSnackBarAction("Passcode do not match"));
                return;
            }

            setBtnClicked(true);
            dispatch(registerUserAction(username, name, email, password, passcode));
        } else {
            dispatch(showSnackBarAction("Please fill all the input fields"));
        }
    }

    return (
        <>
            {redirectToLoginPage ? <Redirect to="/login" /> : null}

            <PurpleGradientContainer childrenClassName="flexCenter">
                <img
                    className="logoImg"
                    alt="logoImg"
                    src={logoImg}
                />
                <div className="logoTitle">{PROJECT_NAME}</div>

                <form className="formContainer" onSubmit={handleRegisterBtnClick}>
                    <input
                        type="text"
                        className="formInputField"
                        placeholder="Username"
                        autoFocus
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    <input
                        type="text"
                        className="formInputField"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <input
                        type="email"
                        className="formInputField"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        className="formInputField"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <input
                        type="password"
                        className="formInputField"
                        placeholder="Confirm Password"
                        value={confPassword}
                        onChange={(e) => setConfPassword(e.target.value)}
                    />

                    <input
                        type="password"
                        className="formInputField"
                        placeholder="Passcode"
                        value={passcode}
                        maxLength={4}
                        onChange={(e) => setPasscode(e.target.value)}
                    />

                    <input
                        type="password"
                        className="formInputField"
                        placeholder="Confirm Passcode"
                        value={confPasscode}
                        maxLength={4}
                        onChange={(e) => setConfPasscode(e.target.value)}
                    />

                    <ActionButton
                        dark={false}
                        showLoader={isRegisteringUser}
                        buttonText="Register"
                        onClick={handleRegisterBtnClick}
                    />
                </form>
            </PurpleGradientContainer>
        </>
    );
}

const mapStateToProps = (state) => {
    return {
        isRegisteringUser: state.isRegisteringUser,
        isUserRegistered: state.isUserRegistered,
    }
}

export default connect(mapStateToProps, undefined)(Register);