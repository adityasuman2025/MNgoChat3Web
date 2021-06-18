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
export const STANDARD_DATE_FORMAT = "DD-MM-YYYY";
export const DEFAULT_DATE = "1999-03-03T";
export const IMAGE_COMPRESSION_OPTIONS = {
    maxSizeMB: 0.1,
    maxWidthOrHeight: 2000,
    useWebWorker: true
};
export const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg"];
export const PAGINATION_MESSAGE_COUNT = 20;
export const APP_DETAILS = {
    details: [
        {
            key: "version",
            value: "3.1",
        },
        {
            key: "release date",
            value: "15 January 2021",
        },
        {
            key: "latest release",
            value: "20 June 2021",
        },
        {
            key: "first release",
            value: "6 July 2018",
        },
        {
            key: "developer",
            value: "Aditya Suman",
        },
        {
            key: "contact",
            value: "aditya@mngo.in",
        },
        {
            key: "technologies used",
            value: "React.js, Redux, Firebase",
        }
    ],
    copyright: "© 2018-21 This property belongs to Aditya Suman",
};

export const CHATS_TITLE = "Chats";
export const USERS_TITLE = "Users";
export const PROFILE_TITLE = "Profile";

//error variables
export const SOMETHING_WENT_WRONG_ERROR = { statusCode: 500, msg: "Something went wrong" };
export const NO_INTERNET_ERROR = { statusCode: 600, msg: "API Connection Failed" };

//color variables
export const THEME_PURPLE = "#35176d";
export const THEME_DARK_PURPLE = "#24133f";
export const THEME_EXTRA_DARK = "#22045a";

export const SECONDARY_PURPLE = "#8d35ad";

export const EXTRA_DARK_GREY = "grey";
export const DARK_GREY = "lightgrey";
export const LIGHT_GREY = "#d8d8d8";

export const THEME_GRADIENT = 'linear-gradient(45deg, ' + THEME_DARK_PURPLE + ',' + THEME_EXTRA_DARK + ')';
export const GREY_GRADIENT = 'linear-gradient(45deg, ' + DARK_GREY + ',' + LIGHT_GREY + ')';
export const MY_MESSAGE_GRADIENT = 'linear-gradient(45deg, ' + THEME_PURPLE + ',' + THEME_EXTRA_DARK + ')';
export const THEIR_MESSAGE_GRADIENT = 'linear-gradient(45deg, ' + THEME_DARK_PURPLE + ',' + THEME_PURPLE + ')';
export const BOTTOM_BAR_GRADIENT = 'linear-gradient(45deg, ' + THEME_DARK_PURPLE + ',' + THEME_EXTRA_DARK + ')';
export const MESSAGE_INPUT_GRADIENT = 'linear-gradient(45deg, ' + THEME_PURPLE + ',' + THEME_EXTRA_DARK + ')';
export const TITLE_BAR_GRADIENT = 'linear-gradient(45deg, ' + SECONDARY_PURPLE + ',' + THEME_DARK_PURPLE + ')';

//style variables
export const TITLE_BAR_HEIGHT = "47px";
export const BOTTOM_NAV_HEIGHT = "50px";
export const BOTTOM_NAV_BOTTOM_MARGIN = "0px";
export const REPLY_PREVIEW_BOX_HEIGHT = "50px";
export const BOTTOM_NAV_WITH_REPLY_PREVIEW_BOX_HEIGHT = "100px";