import React, { useRef } from "react";

import userIcon from "../../images/user.png";
import LoadingAnimation from "../LoadingAnimation";
import ImageWithLoader from "../ImageWithLoader";
import EditIcon from "../../images/edit.png";
import { APP_DETAILS, ALLOWED_IMAGE_TYPES } from "../../constants";
import { getLoggedUserToken } from "../../utils";
import { showSnackBarAction, updateUserToProfileImgMappingAction, uploadImageInFirebaseSuccessAction, uploadImageInFirebaseFailureAction } from "../../redux/actions/index";
import { uploadImageInFirebase } from "../../firebaseUpload";
import { setProfileImageOfAUser } from "../../firebaseQueries";

export default function HomeProfileTab({
    isUploadingImage,
    loggedUsername,
    name,
    email,
    profileImg = userIcon,
    onProfileImgClick,
    dispatch,
}) {
    const imageInputRef = useRef();

    async function handleSelectImage(event) {
        try {
            if (event.target.files && event.target.files[0]) {
                const selectedImg = event.target.files[0];
                const selectedImgType = selectedImg.type;
                if (ALLOWED_IMAGE_TYPES.includes(selectedImgType)) {
                    const imageName = loggedUsername.substring(0, 3) + "_" + getLoggedUserToken().substring(0, 3);
                    await uploadImageInFirebase(dispatch, selectedImg, imageName, "profileImage/")
                        .then((snapshot) => {
                            snapshot.getDownloadURL()
                                .then(async (downloadURL) => {
                                    if (downloadURL) {
                                        await setProfileImageOfAUser(downloadURL);
                                        dispatch(updateUserToProfileImgMappingAction({
                                            username: loggedUsername,
                                            newImageUrl: downloadURL,
                                        }));
                                    }
                                    dispatch(uploadImageInFirebaseSuccessAction());
                                });
                        })
                        .catch((error) => {
                            dispatch(uploadImageInFirebaseFailureAction({ msg: "Fail to upload image" }));
                        });
                } else {
                    dispatch(showSnackBarAction("Only images are allowed"));
                }
            }
        } catch (e) {
            dispatch(showSnackBarAction("Fail to select image", e));
        }
    }

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
                    onChange={handleSelectImage}
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