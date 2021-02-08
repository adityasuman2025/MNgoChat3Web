import React, { useRef, useEffect } from 'react';
import cx from "classnames";

import replyIcon from "../images/reply.png";
import ImageWithLoader from "./ImageWithLoader";

import { MSG_TYPE_IMAGE, MSG_TYPE_REPLY } from "../constants";

export default function MessageItem({
    loggedUserToken,
    formattedTime,
    msgIdToScrollTo,
    msg,
    onImageClick,
    onReplyIconClick,
    onOriginalMsgClick,
}) {
    const msgRef = useRef(null);

    useEffect(() => {
        if (msgIdToScrollTo === msg.messageId) {
            msgRef.current && msgRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }, [msgIdToScrollTo, msg.messageId]);

    const type = msg.type;
    const message = msg.message;
    const originalMessage = msg.originalMessage;
    const originalMessageType = msg.originalMessageType;
    const isMineMsg = msg.sentByUserToken === loggedUserToken;

    function handleReplyIconClick(event) {
        onReplyIconClick(event, msg)
    }

    return (
        <div className={"messageContainer"} ref={msgRef}>
            <div className={cx("message", { ["myMessageAlignment"]: msg.sentByUserToken === loggedUserToken })}>
                <div className={cx({ ["myMessage"]: isMineMsg }, { ["theirMessage"]: !isMineMsg })} onClick={() => onOriginalMsgClick(msg.originalMessageId)}>
                    {
                        type === MSG_TYPE_REPLY ?
                            <div className="replyMessageItem" >
                                {
                                    originalMessageType === MSG_TYPE_IMAGE ?
                                        <ImageWithLoader
                                            src={originalMessage}
                                            className="messageImg"
                                            onClick={(event) => onImageClick(event, originalMessage)}
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
                                onClick={(event) => onImageClick(event, message)}
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