import firebase from './FirebaseConfig';
import imageCompression from 'browser-image-compression';
import { getLoggedUserToken } from "./utils";
import { IMAGE_COMPRESSION_OPTIONS } from "./constants";

import { uploadImageInFirebaseAction, uploadImageInFirebaseFailureAction } from "./redux/actions/index";

export async function uploadImageInFirebase(dispatch, imageFile, uploadImageName, uploadFolder) {
    const loggedUserToken = getLoggedUserToken();
    if (!loggedUserToken || !imageFile) return;

    try {
        dispatch(uploadImageInFirebaseAction());

        const compressedImg = await imageCompression(imageFile, IMAGE_COMPRESSION_OPTIONS);
        if (!compressedImg) return;

        const timeStamp = Math.floor(Date.now());
        const imageName = (uploadImageName || (timeStamp + "_" + loggedUserToken.substring(0, 3))) + ".png";

        //putting image in firebase
        const storageRef = firebase.app().storage().ref().child((uploadFolder || "image/") + imageName);
        await storageRef.put(compressedImg);
        return storageRef;
    } catch {
        dispatch(uploadImageInFirebaseFailureAction({ msg: "Fail to upload image" }));
    }
}