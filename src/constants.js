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
export const MSG_TYPE_IMAGE = "image";
export const MSG_TYPE_REPLY = "reply";
export const DEFAULT_DATE = "1999-03-03T";
export const IMAGE_COMPRESSION_OPTIONS = {
    maxSizeMB: 0.1,
    maxWidthOrHeight: 2000,
    useWebWorker: true
};
export const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg"];
export const PAGINATION_MESSAGE_COUNT = 20;


//error variables
export const SOMETHING_WENT_WRONG_ERROR = { statusCode: 500, msg: "Something went wrong" };
export const NO_INTERNET_ERROR = { statusCode: 600, msg: "Internet Connection Failed" };

//color variables
export const THEME_PURPLE = "#35176d";
export const THEME_DARK_PURPLE = "#24133f";

export const DARK_PURPLE = "#22045a";
export const LIGHT_PURPLE = THEME_PURPLE;

export const EXTRA_DARK_GREY = "grey";
export const DARK_GREY = "lightgrey";
export const LIGHT_GREY = "#d8d8d8";

export const GRADIENT_PURPLE_LIGHT = LIGHT_PURPLE;
export const GRADIENT_PURPLE_DARK = DARK_PURPLE;

export const GRADIENT_GREY_LIGHT = DARK_GREY; //"#6c519c";
export const GRADIENT_GREY_DARK = LIGHT_GREY; //"#3f2177";

//style variables
export const TITLE_BAR_HEIGHT = "50px";
export const BOTTOM_NAV_HEIGHT = "50px";
export const BOTTOM_NAV_BOTTOM_MARGIN = "0px";
export const CHAT_ACTION_BOX_HEIGHT = "50px";
export const REPLY_PREVIEW_BOX_HEIGHT = "50px";
export const CHAT_ACTION_WITH_REPLY_PREVIEW_BOX_HEIGHT = "100px";