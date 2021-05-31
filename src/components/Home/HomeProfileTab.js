import React, { useRef } from "react";

import userIcon from "../../images/user.png";
import LoadingAnimation from "../LoadingAnimation";
import ImageWithLoader from "../ImageWithLoader";
import EditIcon from "../../images/edit.png";
import { APP_DETAILS } from "../../constants";

export default function HomeProfileTab({
    isUploadingImage,
    loggedUsername,
    name,
    email,
    profileImg = userIcon,
    onProfileImgClick,
    onImageSelect,
}) {
    const imageInputRef = useRef();

    function handleProfileImgClick(event) {
        onProfileImgClick(event, profileImg)
    }

    function handleEditIconClick() {
        imageInputRef.current && imageInputRef.current.click();
    }

    return (
        <div className="profileContainer">
            <div className="userProfileImgBox">
                <input
                    ref={imageInputRef}
                    style={{ display: "none" }}
                    type="file"
                    name="myImage"
                    onChange={onImageSelect}
                    accept="image/*"
                />

                {
                    isUploadingImage ?
                        <LoadingAnimation dark loading />
                        :
                        <ImageWithLoader
                            className="userProfileImg"
                            src={profileImg}
                            onClick={handleProfileImgClick}
                        />
                }

                <img
                    alt="editIcon"
                    className="editProfileIcon"
                    src={EditIcon}
                    onClick={handleEditIconClick}
                />
            </div>
            <div className="loggedUserName">{loggedUsername}</div>

            <div className="appDetailsContainer">
                {
                    name ?
                        <div className="userDetailsText">
                            <span className="userDetailsTitle">name: </span>
                            <span>{name}</span>
                        </div>
                        : null
                }
                {
                    email ?
                        <div className="userDetailsText">
                            <span className="userDetailsTitle">email: </span>
                            <span>{email}</span>
                        </div>
                        : null
                }
            </div>
            <div className="divider" />

            <div className="appDetailsContainer">
                {
                    APP_DETAILS.details.map((detail, index) => (
                        <div key={index} className="userDetailsText">
                            <span className="userDetailsTitle">{detail.key}: </span>
                            <span>{detail.value}</span>
                        </div>
                    ))
                }
            </div>
            <div className="divider" />

            <div className="appDetailsContainer">{APP_DETAILS.copyright}</div>
        </div>
    )
}