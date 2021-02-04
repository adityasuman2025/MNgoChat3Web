import React from 'react';
import cx from "classnames";

import replyIcon from "../images/reply.png";
import ImageWithLoader from "./ImageWithLoader";

import { MSG_TYPE_IMAGE, MSG_TYPE_REPLY } from "../constants";

export default function MessageItem({
    loggedUserToken,
    formattedTime,
    msg,
    onImageClick,
    onReplyIconClick,
}) {
    const type = msg.type;
    const message = msg.message;
    const originalMessage = msg.originalMessage;
    const originalMessageType = msg.originalMessageType;
    const isMineMsg = msg.sentByUserToken === loggedUserToken;

    function handleReplyIconClick() {
        onReplyIconClick(msg)
    }

    return (
        <div className={"messageContainer"} >
            <div className={cx("message", { ["myMessageAlignment"]: msg.sentByUserToken === loggedUserToken })} >
                <div className={cx({ ["myMessage"]: isMineMsg }, { ["theirMessage"]: !isMineMsg })}>
                    {
                        type === MSG_TYPE_REPLY ?
                            <div className="replyMessageItem">
                                {
                                    originalMessageType === MSG_TYPE_IMAGE ?
                                        <ImageWithLoader
                                            src={originalMessage}
                                            className="messageImg"
                                            onClick={() => onImageClick(originalMessage)}
                                        />
                                        : originalMessage
                                }
                            </div>
                            : null
                    }
                    {
                        type === MSG_TYPE_IMAGE ?
                            <ImageWithLoader
                                src={message}
                                className="messageImg"
                                onClick={() => onImageClick(message)}
                            />
                            : message
                    }
                    <img
                        alt="replyIcon"
                        className={cx({ ["myReplyIcon"]: isMineMsg }, { ["theirReplyIcon"]: !isMineMsg })}
                        src={replyIcon}
                        onClick={handleReplyIconClick}
                    />
                </div>
            </div>
            <div className="messageTime">{formattedTime}</div>
        </div>
    );
}