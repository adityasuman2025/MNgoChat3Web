import axios from "axios";

import {
    AUTH_API_URL_ADDRESS,
    NO_INTERNET_ERROR,
} from "./constants"

export async function getUserDetails(logged_user_token) {
    try {
        const requestAddress = AUTH_API_URL_ADDRESS + "get_user_details.php";
        const response = await axios.post(requestAddress, {
            logged_user_token
        });

        return response.data;
    } catch {
        return NO_INTERNET_ERROR;
    }
}

export async function VerifyLogin(username, password) {
    try {
        const requestAddress = AUTH_API_URL_ADDRESS + "verify_user.php";
        const response = await axios.post(requestAddress, {
            username,
            password,
        });

        return response.data;
    } catch {
        return NO_INTERNET_ERROR;
    }
}

export async function registerNewUser(username, name, email, password, passcode) {
    try {
        const requestAddress = AUTH_API_URL_ADDRESS + "register_user.php";
        const response = await axios.post(requestAddress, {
            username,
            name,
            email,
            password,
            passcode,
            registeringFor: "ChatApp",
        });

        return response.data;
    } catch {
        return NO_INTERNET_ERROR;
    }
}

export async function VerifyPassCode(logged_user_token, passcode) {
    try {
        const requestAddress = AUTH_API_URL_ADDRESS + "verify_passcode.php";
        const response = await axios.post(requestAddress, {
            logged_user_token,
            passcode,
        });

        return response.data;
    } catch {
        return NO_INTERNET_ERROR;
    }
}