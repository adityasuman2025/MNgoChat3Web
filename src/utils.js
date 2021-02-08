import { enc, AES } from "crypto-js";
import Cookies from "universal-cookie";

import { ENCRYPTION_KEY } from "./encryptionConstants";
import { COOKIE_EXPIRATION_TIME, LOGGED_USER_TOKEN_COOKIE_NAME } from "./constants";
const cookies = new Cookies();

//function to get cookie value
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
};

//function to set cookie 
export function makeCookie(key, value) {
    try {
        cookies.set(key, value, { path: "/", expires: COOKIE_EXPIRATION_TIME, });

        return true;
    } catch {
        return false;
    }
};

export function encryptText(text) {
    try {
        const encryptedValue = AES.encrypt(text, ENCRYPTION_KEY).toString();
        return encryptedValue;
    } catch {
        return null;
    }
}

export function decryptText(enryptedValue) {
    let value = null;
    try {
        const decrypted = AES.decrypt(enryptedValue, ENCRYPTION_KEY);
        value = enc.Utf8.stringify(decrypted);
    } catch {
        return null;
    }

    return value;
}

//function to validate name, contact no and email
export function validateUsername(name) {
    var re = /^[a-zA-Z0-9_]*$/;
    return re.test(name);
};

export function validateName(name) {
    var re = /^[a-zA-Z0-9 ]*$/;
    return re.test(name);
};

export function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};

export function validateNumber(number) {
    var re = /^[0-9]*$/;
    return re.test(number);
};

export function getLoggedUserToken() {
    return getCookieValue(LOGGED_USER_TOKEN_COOKIE_NAME);
}

export function getUserTokenOfTheSecondUser(members) {
    if (!members) {
        return null
    }
    let userTokenOfSecondUser = null;

    const loggedUserToken = getLoggedUserToken();
    if (Object.keys(members).length === 2) {
        try {
            for (const userToken in members) {
                if (userToken !== loggedUserToken) {
                    userTokenOfSecondUser = userToken;
                    break;
                }
            }
        } catch { }
    }

    return userTokenOfSecondUser;
}

export function getUsernameOfTheSecondUser(members) {
    if (!members) {
        return null
    }
    let usernameOfSecondUser = null;

    const loggedUserToken = getLoggedUserToken();
    if (Object.keys(members).length === 2) {
        try {
            for (const userToken in members) {
                if (userToken !== loggedUserToken) {
                    usernameOfSecondUser = members[userToken].name;
                    break;
                }
            }
        } catch { }
    }

    return usernameOfSecondUser;
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

//function to logout
export async function logout() {
    await cookies.remove(LOGGED_USER_TOKEN_COOKIE_NAME, { path: "/", expires: COOKIE_EXPIRATION_TIME });
};