import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import allUsers from "../images/allUsers.png";
import allFrnds from "../images/allFrnds.png";

import {
    BOTTOM_NAV_HEIGHT,
    BOTTOM_NAV_BOTTOM_MARGIN,
    LOGGED_USER_TOKEN_COOKIE_NAME
} from "../constants";
import { getCookieValue } from "../utils";
import {
    getUserChatRooms,
} from "../firebaseQueries";

function HomePageContent({
    userAllChats,
    dispatch,
}) {
    console.log("userAllChats", userAllChats);
    useEffect(() => {
        const loggedUserToken = getCookieValue(LOGGED_USER_TOKEN_COOKIE_NAME);
        if (loggedUserToken) {
            getUserChatRooms(dispatch, loggedUserToken);
        }
    }, []);

    return (
        <div className="homeContainer">
            <div
                className="homeContentContainer"
                style={{
                    "--bottomNavHeight": BOTTOM_NAV_HEIGHT,
                    "--bottomNavMarginBottom": BOTTOM_NAV_BOTTOM_MARGIN,
                }}
            >
                all good
             </div>
            <div
                className="homeBottomNavContainer"
                style={{
                    "--bottomNavHeight": BOTTOM_NAV_HEIGHT,
                    "--bottomNavMarginBottom": BOTTOM_NAV_BOTTOM_MARGIN,
                }}
            >
                <img
                    className="bottomTabIcons"
                    alt="allFrnds"
                    src={allFrnds}
                />

                <img
                    className="bottomTabIcons"
                    alt="allUsers"
                    src={allUsers}
                />
            </div>
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        isGettingUserAllChats: state.isGettingUserAllChats,
        userAllChats: state.userAllChats,
    }
}

export default connect(mapStateToProps, undefined)(HomePageContent);