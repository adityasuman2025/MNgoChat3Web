import React from "react";
import cx from "classnames";

import allChats from "../../images/allChats.png";
import allUsersIcon from "../../images/allUsers.png";
import ProfileIcon from "../../images/profile.png";
import { BOTTOM_NAV_HEIGHT, BOTTOM_NAV_BOTTOM_MARGIN, CHATS_TITLE, USERS_TITLE, PROFILE_TITLE, BOTTOM_BAR_GRADIENT } from "../../constants";

export default function HomeBottomNav({
    selectedTab,
    onNavBtnClick,
}) {
    return (
        <div
            className="homeBottomNavContainer"
            style={{
                "--bottomNavHeight": BOTTOM_NAV_HEIGHT,
                "--bottomNavMarginBottom": BOTTOM_NAV_BOTTOM_MARGIN,
                background: BOTTOM_BAR_GRADIENT,
            }}
        >
            <img
                className={cx("bottomTabIcons", { ["selectedBottomTabIcon"]: selectedTab === CHATS_TITLE })}
                alt="allChats"
                src={allChats}
                onClick={() => onNavBtnClick(CHATS_TITLE)}
            />

            <img
                className={cx("bottomTabIcons", { ["selectedBottomTabIcon"]: selectedTab === USERS_TITLE })}
                alt="allUsers"
                src={allUsersIcon}
                onClick={() => onNavBtnClick(USERS_TITLE)}
            />

            <img
                className={cx("bottomTabIcons", { ["selectedBottomTabIcon"]: selectedTab === PROFILE_TITLE })}
                alt="profile"
                src={ProfileIcon}
                onClick={() => onNavBtnClick(PROFILE_TITLE)}
            />
        </div>
    )
}