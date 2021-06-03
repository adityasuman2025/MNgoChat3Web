import React, { useRef, useEffect } from 'react';
import ReactTextFormat from 'react-text-format';
import cx from "classnames";
import ImageWithLoader from "../ImageWithLoader";
import { getLoggedUserToken } from "../../utils";
import { decryptText } from "../../encryptionUtil";
import { MSG_TYPE_IMAGE, MSG_TYPE_REPLY, MY_MESSAGE_GRADIENT, THEIR_MESSAGE_GRADIENT } from "../../constants";

export default function ChatMessageItem({
    isSeen,
    formattedTime,
    msgIdToScrollTo,
    msg,
    onImageClick,
    onReplyIconClick,
    onOriginalMsgClick,
}) {
    const loggedUserToken = getLoggedUserToken();
    const msgRef = useRef(null);

    const type = msg.type;
    const message = decryptText(msg.message);
    const originalMessage = decryptText(msg.originalMessage);
    const originalMessageType = msg.originalMessageType;
    const isMineMsg = msg.sentByUserToken === loggedUserToken;

    useEffect(() => {
        if (msgIdToScrollTo === msg.messageId) {
            msgRef.current && msgRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }, [msgIdToScrollTo, msg.messageId]);

    function handleMsgItemClick(event) {
        //double click triggers reply action
        if (event.detail === 2) {
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
        <div className="messageContainer" ref={msgRef} onClick={handleMsgItemClick}>
            <div className={cx("messageContent", { ["myMessageAlignment"]: msg.sentByUserToken === loggedUserToken })} >
                <div
                    className={"message"}
                    style={
                        isMineMsg ?
                            {
                                background: MY_MESSAGE_GRADIENT,
                                textAlign: "right",
                            }
                            :
                            {
                                background: THEIR_MESSAGE_GRADIENT,
                                borderRadius: "25px",
                                borderTopLeftRadius: "0px",
                            }
                    }
                >
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

                </div>
            </div>
            <div className="messageTime">
                {formattedTime}
                {isMineMsg && isSeen ? <div className="seenText">seen</div> : null}
            </div>
        </div>
    );
}