import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import logoutIcon from "../../images/logout.png";
import LoadingAnimation from "../LoadingAnimation";
import ImageViewer from "../ImageViewer";
import HomeBottomNav from "./HomeBottomNav";
import UserListItem from "./UserListItem";
import HomeProfileTab from "./HomeProfileTab";
import { getLoggedUserToken, logout } from "../../utils";
import { encryptText } from "../../encryptionUtil";
import { TITLE_BAR_HEIGHT, BOTTOM_NAV_HEIGHT, TITLE_BAR_GRADIENT, BOTTOM_NAV_BOTTOM_MARGIN, CHATS_TITLE, USERS_TITLE, PROFILE_TITLE, ALLOWED_IMAGE_TYPES } from "../../constants";

import {
    showSnackBarAction,
    updateUserToProfileImgMappingAction,
    uploadImageInFirebaseSuccessAction,
    uploadImageInFirebaseFailureAction,
} from "../../redux/actions/index";
import {
    setUserActiveStatus,
    getUserChatRooms,
    getAllUsers,
    removeGetUserChatRoomsFirebaseQuery,
    setProfileImageOfAUser,
} from "../../firebaseQueries";
import { uploadImageInFirebase } from "../../firebaseUpload";

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

    function handleUserItemClick(data) {
        if (!data) return;
        if (!Object.keys(data).length) return;

        if (data.name && data.token) {
            try {
                let urlParam = encryptText(JSON.stringify(data));
                for (const chatRoomId in userAllChats) {
                    const userChatRoom = userAllChats[chatRoomId];
                    const secondUserToken = userChatRoom.secondUserToken;

                    //if that user is already present in all-chats of loggedUser
                    //then redirecting him to the chat page of that chatRoomId
                    if (data.token === secondUserToken) {
                        data.chatRoomId = chatRoomId;
                        urlParam = encryptText(JSON.stringify(data));
                        history.push("chat/" + urlParam);
                        return;
                    }
                }

                // if that user is not present in all-chats of loggedUser
                // then redirecting him to the new-chat page for that secondUserToken (other userToken)
                history.push("new-chat/" + urlParam);
            } catch { }
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
                <div className="homeTitle" style={{ "--titleBarHeight": TITLE_BAR_HEIGHT, background: TITLE_BAR_GRADIENT }}>
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