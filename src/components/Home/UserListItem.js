import React from "react";
import cx from "classnames";

import userIcon from "../../images/user.png";

export default function HomeBottomNav({
    userData: {
        unSeenMsgCount = 0,
        displayName,
        username, //in-case of allUsers (USERS_TITLE) username will come but not displayName
        secondUserToken,
        userToken,
    } = {},
    userToProfileImgMapping = {},
    onClick,
    onImageClick,
}) {
    const userProfileImg = userToProfileImgMapping[displayName || username];

    function handleOnClick() {
        onClick({
            name: displayName || username,
            token: secondUserToken || userToken,
            profileImg: userProfileImg,
        });
    }

    function handleProfileImgClick(event) {
        onImageClick(event, userProfileImg);
    }

    return (
        <div
            className={cx("listUserItem", { ["unSeenMsgUser"]: unSeenMsgCount > 0 })}
            onClick={handleOnClick}
        >
            <img alt="userIcon" src={userProfileImg || userIcon} onClick={handleProfileImgClick} />
            <div className="listUserItemTitle">{displayName || username}</div>
        </div>
    )
}