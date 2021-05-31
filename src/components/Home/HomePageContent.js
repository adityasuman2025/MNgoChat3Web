import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import logoutIcon from "../../images/logout.png";
import LoadingAnimation from "../LoadingAnimation";
import ImageViewer from "../ImageViewer";
import HomeBottomNav from "./HomeBottomNav";
import UserListItem from "./UserListItem";
import HomeProfileTab from "./HomeProfileTab";
import { encryptText, getLoggedUserToken, logout } from "../../utils";
import { TITLE_BAR_HEIGHT, BOTTOM_NAV_HEIGHT, BOTTOM_NAV_BOTTOM_MARGIN, CHATS_TITLE, USERS_TITLE, PROFILE_TITLE, ALLOWED_IMAGE_TYPES } from "../../constants";

import {
    showSnackBarAction,
    updateUserToProfileImgMapping,
    uploadImageInFirebaseSuccessAction,
    uploadImageInFirebaseFailureAction,
} from "../../redux/actions/index";
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
    userToProfileImgMapping = {},
    userAllChats = {},
    userDetails: {
        username: loggedUsername,
        name,
        email,
    } = {},
    history,
    dispatch,
}) {
    const [title, setTitle] = useState(CHATS_TITLE);
    const [viewImg, setViewImg] = useState(null);

    useEffect(() => {
        getUserChatRooms(dispatch);
        getAllUsers(dispatch);
        setUserActiveStatus();

        const setActiveStatusInterval = setInterval(function() {
            setUserActiveStatus();
        }, 10000); //setting user lastActive time every 10 seconds
        //other users need to compare their local time with that user lastActiveTime to get his active status

        return () => {
            removeGetUserChatRoomsFirebaseQuery();
            clearInterval(setActiveStatusInterval);
        }
    }, []);

    async function handleLogoutBtnClick() {
        await logout(dispatch);
        window.location.reload();
    }

    function handleNavBtnClick(type) {
        setTitle(type);
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
                                        dispatch(updateUserToProfileImgMapping({
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

    function handleUserItemClick(data) {
        if (!data) return;
        if (!Object.keys(data).length) return;

        if (data.name && data.token) {
            const urlParam = encryptText(JSON.stringify(data));
            if (data.chatRoomId) {
                history.push("chat/" + urlParam);
            } else {
                history.push("new-chat/" + urlParam);
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
            // console.log('userData', userData)
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
                return (
                    <HomeProfileTab
                        isUploadingImage={isUploadingImage}
                        loggedUsername={loggedUsername}
                        name={name}
                        email={email}
                        profileImg={userToProfileImgMapping[loggedUsername]}
                        onProfileImgClick={handleProfileImgClick}
                        onImageSelect={handleSelectImage}
                    />
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
        userToProfileImgMapping: state.userToProfileImgMapping,
        userAllChats: state.userAllChats,
        userDetails: state.userDetails,
    }
}

export default connect(mapStateToProps, undefined)(HomePageContent);