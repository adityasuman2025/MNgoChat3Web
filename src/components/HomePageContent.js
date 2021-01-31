import React from 'react';
import { connect } from 'react-redux';

import allUsers from "../images/allUsers.png";
import allFrnds from "../images/allFrnds.png";

import { BOTTOM_NAV_HEIGHT, BOTTOM_NAV_BOTTOM_MARGIN } from "../constants";

function HomePageContent({
    dispatch,
}) {
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

    }
}

export default connect(mapStateToProps, undefined)(HomePageContent);