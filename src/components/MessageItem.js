import React, { useRef, useEffect } from 'react';
import ReactTextFormat from 'react-text-format';
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

    const type = msg.type;
    const message = msg.message;
    const originalMessage = msg.originalMessage;
    const originalMessageType = msg.originalMessageType;
    const isMineMsg = msg.sentByUserToken === loggedUserToken;

    useEffect(() => {
        if (msgIdToScrollTo === msg.messageId) {
            msgRef.current && msgRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }, [msgIdToScrollTo, msg.messageId]);

    function handleMsgItemClick(event) {
        if (event.detail === 1) {
            // console.log("single click")
        } else if (event.detail === 2) {
            // console.log("double click")
            onReplyIconClick(event, msg)
        }
    }

    function customLinkDecorator(decoratedHref, decoratedText, linkTarget, key) {
        return (
            <a
                key={key}
                href={decoratedHref}
                target="_blank"
                rel='noreferrer'
                className='messageItemLink'
            >
                {decoratedText}
            </a>
        )
    }

    function customPhoneDecorator(decoratedText, key) {
        return (
            <a
                key={key}
                href={"tel:" + decoratedText}
                target="_blank"
                rel='noreferrer'
                className='messageItemLink'
            >
                {decoratedText}
            </a>
        )
    }

    return (
        <div className={"messageContainer"} ref={msgRef} onClick={handleMsgItemClick}>
            <div className={cx("message", { ["myMessageAlignment"]: msg.sentByUserToken === loggedUserToken })} >
                <div className={cx({ ["myMessage"]: isMineMsg }, { ["theirMessage"]: !isMineMsg })}>
                    {
                        type === MSG_TYPE_REPLY ?
                            <div className="replyMessageItem" onClick={() => onOriginalMsgClick(msg.originalMessageId)}>
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
                            :
                            <ReactTextFormat
                                allowedFormats={['URL', 'Email', 'Phone']}
                                linkDecorator={customLinkDecorator}
                                emailDecorator={customLinkDecorator}
                                phoneDecorator={customPhoneDecorator}
                            >
                                {message}
                            </ReactTextFormat>
                    }
                    <img
                        alt="replyIcon"
                        className={cx({ ["myReplyIcon"]: isMineMsg }, { ["theirReplyIcon"]: !isMineMsg })}
                        src={replyIcon}
                        onClick={(event) => onReplyIconClick(event, msg)}
                    />
                </div>
            </div>
            <div className="messageTime">{formattedTime}</div>
        </div>
    );
}