import { enc, AES } from "crypto-js";
import { ENCRYPTION_KEY } from "./encryptionConstants";

export function encryptText(text) {
    try {
        const encryptedValue = AES.encrypt(text, ENCRYPTION_KEY).toString();
        return encryptedValue;
    } catch {
        return null;
    }
}

export function decryptText(enryptedValue) {
    let value = null;
    try {
        const decrypted = AES.decrypt(enryptedValue, ENCRYPTION_KEY);
        value = enc.Utf8.stringify(decrypted);
    } catch {
        return null;
    }

    return value;
}