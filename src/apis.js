import { sendRequestToAPI } from "./utils";
import { SOMETHING_WENT_WRONG_ERROR } from "./constants"

export async function getUserDetails(logged_user_token) {
    try {
        return await sendRequestToAPI("get_user_details.php", {
            logged_user_token,
        });
    } catch {
        return SOMETHING_WENT_WRONG_ERROR;
    }
}

export async function verifyLogin(username, password) {
    try {
        return await sendRequestToAPI("verify_user.php", {
            username,
            password,
        });
    } catch {
        return SOMETHING_WENT_WRONG_ERROR;
    }
}

export async function registerNewUser(username, name, email, password, passcode) {
    try {
        return await sendRequestToAPI("register_user.php", {
            username,
            name,
            email,
            password,
            passcode,
            registeringFor: "ChatApp",
        });
    } catch {
        return SOMETHING_WENT_WRONG_ERROR;
    }
}

export async function verifyPassCode(logged_user_token, passcode) {
    try {
        return await sendRequestToAPI("verify_passcode.php", {
            logged_user_token,
            passcode,
        });
    } catch {
        return SOMETHING_WENT_WRONG_ERROR;
    }
}