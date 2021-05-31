import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import cx from "classnames";

import userIcon from "../../images/user.png";
import EditIcon from "../../images/edit.png";
import logoutIcon from "../../images/logout.png";
import LoadingAnimation from "../LoadingAnimation";
import ImageViewer from "../ImageViewer";
import ImageWithLoader from "../ImageWithLoader";
import HomeBottomNav from "./HomeBottomNav";
import UserListItem from "./UserListItem";
import { getLoggedUserToken, logout } from "../../utils";
import { TITLE_BAR_HEIGHT, BOTTOM_NAV_HEIGHT, BOTTOM_NAV_BOTTOM_MARGIN, ALLOWED_IMAGE_TYPES, APP_DETAILS, CHATS_TITLE, USERS_TITLE, PROFILE_TITLE } from "../../constants";

import { showSnackBarAction, uploadImageInFirebaseSuccessAction, uploadImageInFirebaseFailureAction } from "../../redux/actions/index";
import {
    setUserActiveStatus,
    getUserChatRooms,
    getAllUsers,
    removeGetUserChatRoomsFirebaseQuery,
    uploadImageInFirebase,
    setProfileImageOfAUser,
} from "../../firebaseQueries";


function HomePageContent({
    isGettingUserAllChats,
    isGettingAllUsers,
    isUploadingImage,
    allUsers = {},
    userAllChats = {},
    userDetails: {
        username: loggedUsername,
        name,
        email,
    } = {},
    history,
    dispatch,
}) {
    const imageInputRef = useRef();

    const [title, setTitle] = useState(CHATS_TITLE);
    const [viewImg, setViewImg] = useState(null);
    const [userToProfileImgMapping, setUserToProfileImgMapping] = useState({});

    useEffect(() => {
        getUserChatRooms(dispatch);
        getAllUsers(dispatch);
        setUserActiveStatus(true);

        const setActiveStatusInterval = setInterval(function() {
            setUserActiveStatus(true);
        }, 10000); //setting user lastActive time every 10 seconds
        //other users need to compare their local time with that user lastActiveTime to get his active status

        return () => {
            removeGetUserChatRoomsFirebaseQuery();
            clearInterval(setActiveStatusInterval);
        }
    }, []);

    useEffect(() => {
        if (allUsers) {
            const usersProfileImg = {};
            Object.keys(allUsers).map(function(userToken) {
                const user = allUsers[userToken];
                const displayName = user.username;
                const profileImg = user.profileImg || userIcon;

                usersProfileImg[displayName] = profileImg;
            });
            setUserToProfileImgMapping(usersProfileImg)
        }
    }, [allUsers]);

    async function handleLogoutBtnClick() {
        await logout(dispatch);
        window.location.reload();
    }

    function handleNavBtnClick(type) {
        setTitle(type);
    }

    function handleEditIconClick() {
        imageInputRef.current && imageInputRef.current.click();
    }

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
                                        setUserToProfileImgMapping({
                                            ...userToProfileImgMapping,
                                            [loggedUsername]: downloadURL,
                                        });
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

    function handleUserItemClick(data) {
        if (!data) return;

        if (title === CHATS_TITLE) {
            history.push("chat/" + data); //data = chatRoomId
        } else {
            const selectedUsername = data.username;
            const selectedUserToken = data.userToken;
            if (selectedUsername && selectedUserToken) {
                try {
                    for (const chatRoomId in userAllChats) {
                        const userChatRoom = userAllChats[chatRoomId];
                        const secondUserToken = userChatRoom.secondUserToken;

                        //if that user is already present in all-chats of loggedUser
                        //then redirecting him to the chat page of that chatRoomId
                        if (selectedUserToken === secondUserToken) {
                            history.push("chat/" + chatRoomId);
                            return;
                        }
                    }

                    // if that user is not present in all-chats of loggedUser
                    // then redirecting him to the new-chat page for that secondUserToken (other userToken)
                    const selectedUserDetails = { name: selectedUsername, token: selectedUserToken };
                    history.push("new-chat/" + JSON.stringify(selectedUserDetails));
                } catch { }
            }
        }
    }

    function handleProfileImgClick(event, src) {
        event.stopPropagation(); //to prevent trigger of parent onClick

        if (src) {
            setViewImg(src);
        }
    }

    function renderUsersList() {
        const unReadChats = [];
        const readChats = [];
        Object.keys(title === CHATS_TITLE ? userAllChats : allUsers).map(function(chatRoomId, index) {
            const userToken = chatRoomId;  //chatRoomId is userToken in-case of allUsers (USERS_TITLE)
            const userData = title === CHATS_TITLE ? userAllChats[chatRoomId] : allUsers[userToken];
            const unSeenMsgCount = parseInt(userData.unSeenMsgCount) || 0;
            const displayName = userData.displayName || userData.username;

            if (!displayName || displayName === loggedUsername) return;

            if (unSeenMsgCount === 0) {
                readChats.push(
                    <UserListItem
                        key={chatRoomId + index}
                        userData={userData}
                        userToProfileImgMapping={userToProfileImgMapping}
                        onClick={handleUserItemClick}
                        onImageClick={handleProfileImgClick}
                    />
                )
            } else {
                unReadChats.push(
                    <UserListItem
                        key={chatRoomId + index}
                        userData={userData}
                        userToProfileImgMapping={userToProfileImgMapping}
                        onClick={handleUserItemClick}
                        onImageClick={handleProfileImgClick}
                    />
                )
            }
        });

        // unread msg chatRooms will be listed first
        return (
            <>
                { unReadChats}
                { readChats}
            </>
        );
    }

    function renderTabContent() {
        switch (title) {
            case CHATS_TITLE:
                return renderUsersList();
            case USERS_TITLE:
                return renderUsersList();
            case PROFILE_TITLE:
                const profileImg = userToProfileImgMapping[loggedUsername];
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
                                        onClick={(e) => handleProfileImgClick(e, profileImg)}
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
                                APP_DETAILS.details.map(detail => (
                                    <div className="userDetailsText">
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
            default:
        }
    }

    return (
        <div className="homeContainer">
            {viewImg ? <ImageViewer src={viewImg} onClose={() => setViewImg(null)} /> : null}

            <div
                className="homeContentContainer"
                style={{
                    "--bottomNavHeight": BOTTOM_NAV_HEIGHT,
                    "--bottomNavMarginBottom": BOTTOM_NAV_BOTTOM_MARGIN,
                }}
            >
                <div className="homeTitle" style={{ "--titleBarHeight": TITLE_BAR_HEIGHT }}>
                    <div className="lightTitle">{title}</div>
                    <img alt="logoutIcon" src={logoutIcon} onClick={handleLogoutBtnClick} />
                </div>
                <div className="homeContent" style={{ "--titleBarHeight": TITLE_BAR_HEIGHT }}>
                    {
                        isGettingUserAllChats || isGettingAllUsers ?
                            <LoadingAnimation dark loading />
                            :
                            <div>{renderTabContent()}</div>
                    }
                </div>
            </div>

            <HomeBottomNav selectedTab={title} onNavBtnClick={handleNavBtnClick} />
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        isGettingUserAllChats: state.isGettingUserAllChats,
        isGettingAllUsers: state.isGettingAllUsers,
        isUploadingImage: state.isUploadingImage,
        allUsers: state.allUsers,
        userAllChats: state.userAllChats,
        userDetails: state.userDetails,
    }
}

export default connect(mapStateToProps, undefined)(HomePageContent);