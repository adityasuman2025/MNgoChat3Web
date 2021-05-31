import React from "react";
import cx from "classnames";

export default function HomeBottomNav({
    userData,
    userData: {
        chatRoomId,
        unSeenMsgCount = 0,
        displayName,
        username, //in-case of allUsers (USERS_TITLE) username will come but not displayName
    } = {},
    userToProfileImgMapping = {},
    onClick,
    onImageClick,
}) {
    const userProfileImg = userToProfileImgMapping[displayName || username];

    function handleOnClick() {
        onClick(chatRoomId || userData);
    }

    function handleProfileImgClick(event) {
        onImageClick(event, userProfileImg);
    }

    return (
        <div
            className={cx("listUserItem", { ["unSeenMsgUser"]: unSeenMsgCount > 0 })}
            onClick={handleOnClick}
        >
            <img alt="userIcon" src={userProfileImg} onClick={handleProfileImgClick} />
            <div className="listUserItemTitle">{displayName || username}</div>
        </div>
    )
}