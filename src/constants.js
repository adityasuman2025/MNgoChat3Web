// variables for setting cookie expiratiom tym
export const COOKIE_EXPIRATION_MINS = 30 * 24 * 60; // 30 days

let COOKIE_EXPIRATION_TYM = new Date();
COOKIE_EXPIRATION_TYM.setTime(COOKIE_EXPIRATION_TYM.getTime() + (COOKIE_EXPIRATION_MINS * 60 * 1000));
export const COOKIE_EXPIRATION_TIME = COOKIE_EXPIRATION_TYM;

//api variables
export const AUTH_API_URL_ADDRESS = "https://mngo.in/auth_api/";

//general variables
export const PROJECT_NAME = "MNgo Chat";
export const LOGGED_USER_TOKEN_COOKIE_NAME = "mngoChatLoggenUserToken";

//error variables
export const SOMETHING_WENT_WRONG_ERROR = { statusCode: 500, msg: "Something went wrong" };
export const NO_INTERNET_ERROR = { statusCode: 600, msg: "Internet Connection Failed" };