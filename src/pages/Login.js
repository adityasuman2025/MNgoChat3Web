import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect } from "react-router-dom";

import logoImg from "../images/logo.png";
import PurpleGradientContainer from "../components/PurpleGradientContainer";
import ActionButton from "../components/ActionButton";
import SignInUpButton from "../components/SignInUpButton";

import { PROJECT_NAME } from "../constants";
import { checkLoginStatusAction, loginUserAction } from "../redux/actions/index";

function Login({
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

    //when any change in reducer state variable "loginInfo" takes place
    // useEffect(() => {
    //     (async () => {
    //         if (Object.keys(loginInfo).length > 0) {
    //             const { statusCode, msg, data, token } = loginInfo;
    //             if (statusCode === 200) {
    //                 if (data && token) {
    //                     //creating cookie of the user details
    //                     const loggedUserId = await makeEncryptedAsyncStorage("loggedUserId", data.id);
    //                     const loggedUserName = await makeEncryptedAsyncStorage("loggedUserName", data.name);
    //                     const loggedUserUsername = await makeEncryptedAsyncStorage("loggedUserUsername", data.username);
    //                     const loggedUserEmail = await makeEncryptedAsyncStorage("loggedUserEmail", data.email);
    //                     const loggedUserToken = await makeEncryptedAsyncStorage("loggedUserToken", token);
    //                     if (loggedUserId && loggedUserName && loggedUserUsername && loggedUserEmail && loggedUserToken) {
    //                         // displaySnackBar("success", msg);
    //                         //redirecting to dashboard screen
    //                         navigation.replace("Dashboard");
    //                         return;
    //                     } else {
    //                         displaySnackBar("error", "Seomthing went wrong");
    //                     }
    //                 } else {
    //                     displaySnackBar("error", "Seomthing went wrong");
    //                 }
    //             } else {
    //                 displaySnackBar("error", msg);
    //             }
    //             setIsLoading(false);
    //         }
    //     })();
    // }, [loginInfo]);

    function handleLoginBtnClick() {
        // dispatch && dispatch(loginUserAction(username, password));
        // if (username !== "" && password !== "") {
        //     // setIsLoading(true);
        //     // dispatch && dispatch(loginUserAction(username, password));
        // } else {
        //     // displaySnackBar("error", "Please fill all the input fields");
        // }
    }

    function handleSignUpBtnClick() {
        history.push("/register");
    }

    return (
        <>
            {
                !isCheckingLoginStatus && isSomeoneLoggedIn ? <Redirect to="/home" /> : null
            }

            <PurpleGradientContainer childrenClassName="flexCenter">
                <img
                    className="logoImg"
                    alt="logoImg"
                    src={logoImg}
                />
                <div className="logoTitle">{PROJECT_NAME}</div>

                <input
                    type="text"
                    className="formInputField"
                    placeholder="Username"
                    autoFocus
                    value={username}
                    onChange={(e) => setUsername(e.val)}
                />

                <input
                    type="password"
                    className="formInputField"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.val)}
                />


                <ActionButton
                    dark={false}
                    // showLoader={true}
                    buttonText="Login"
                    onClick={handleLoginBtnClick}
                />

                <SignInUpButton
                    otherText="Don't have an account yet?"
                    buttonText="Signup"
                    onClick={handleSignUpBtnClick}
                />
            </PurpleGradientContainer>
        </>
    );
}

const mapStateToProps = (state) => {
    return {
        isCheckingLoginStatus: state.isCheckingLoginStatus,
        isSomeoneLoggedIn: state.isSomeoneLoggedIn,
    }
}

export default connect(mapStateToProps, undefined)(Login);