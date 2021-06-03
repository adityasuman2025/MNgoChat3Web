import { Redirect } from "react-router-dom";
import Cookies from "universal-cookie";
import logoImg from "./images/logo.png";
import { COOKIE_EXPIRATION_TIME, LOGGED_USER_TOKEN_COOKIE_NAME, AUTH_API_URL_ADDRESS, NO_INTERNET_ERROR } from "./constants";
const cookies = new Cookies();

export function getCookieValue(cookie_name) {
    let value = null;
    try {
        const cookieValue = cookies.get(cookie_name);
        if (cookieValue) {
            value = cookieValue;
        }
    } catch {
        value = null;
    }

    return value;
}

export function makeCookie(key, value) {
    try {
        cookies.set(key, value, { path: "/", expires: COOKIE_EXPIRATION_TIME, });

        return true;
    } catch {
        return false;
    }
}

export async function sendRequestToAPI(endpoint, body) {
    try {
        const requestAddress = AUTH_API_URL_ADDRESS + endpoint;
        const response = await fetch(requestAddress, {
            method: "post",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        return await response.json();
    } catch {
        return NO_INTERNET_ERROR;
    }
}

export function validateUsername(name) {
    var re = /^[a-zA-Z0-9_]*$/;
    return re.test(name);
}

export function validateName(name) {
    var re = /^[a-zA-Z0-9 ]*$/;
    return re.test(name);
}

export function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

export function validateNumber(number) {
    var re = /^[0-9]*$/;
    return re.test(number);
}

export function getLoggedUserToken() {
    return getCookieValue(LOGGED_USER_TOKEN_COOKIE_NAME);
}

export function isEmpty(obj) {

    // null and undefined are "empty"
    if (obj == null) return true;

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0) return false;
    if (obj.length === 0) return true;

    // If it isn't an object at this point
    // it is empty, but it can't be anything *but* empty
    // Is it empty?  Depends on your application.
    if (typeof obj !== "object") return true;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
}

export function redirectToHomeOrLoginPage(isSomeoneLoggedIn) {
    if (isSomeoneLoggedIn) {
        return <Redirect to="/home" />;
    } else {
        return <Redirect to="/login" />;
    }
}

export function redirectToLoginPage() {
    return <Redirect to="/login" />;
}

export function getLogoImg() {
    return logoImg;
}

export async function logout() {
    await cookies.remove(LOGGED_USER_TOKEN_COOKIE_NAME, { path: "/", expires: COOKIE_EXPIRATION_TIME });
}