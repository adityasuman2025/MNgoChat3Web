import React from "react";
import userIcon from "../../images/user.png";
import { TITLE_BAR_HEIGHT, TITLE_BAR_GRADIENT } from "../../constants";

export default function ChatTitleBar({
    name,
    profileImg = userIcon,
    typeStatus,
    activeStatus,
    onImageClick,
}) {
    function handleImageClick(event) {
        onImageClick(event, profileImg)
    }

    return (
        <div className="chatTitle" style={{ "--titleBarHeight": TITLE_BAR_HEIGHT, background: TITLE_BAR_GRADIENT }}>
            <img alt="userIcon" src={profileImg} onClick={handleImageClick} />
            <div>
                <div className="lightTitle">{name}</div>
                <div className="onlineStatus">{typeStatus || activeStatus}</div>
            </div>
        </div>
    )
}