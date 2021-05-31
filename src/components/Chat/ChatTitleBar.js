import React from "react";
import dayjs from "../../dayjs";

import userIcon from "../../images/user.png";
import { TITLE_BAR_HEIGHT } from "../../constants";

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
        <div
            className="chatTitle"
            style={{ "--titleBarHeight": TITLE_BAR_HEIGHT }}
        >
            <img alt="userIcon" src={profileImg} onClick={handleImageClick} />
            <div>
                <div className="lightTitle">{name}</div>
                <div className="onlineStatus">
                    {
                        typeStatus
                            ||
                            activeStatus ?
                            activeStatus === "online" ? "online"
                                : dayjs(activeStatus).format("lll")
                            : ""
                    }
                </div>
            </div>
        </div>
    )
}