import { db } from "@/lib/firebase/config";
import { doc, getDoc } from "firebase/firestore";

export async function usernameAlreadyExists(username){
    try {
        const documentRef = doc(db, "listOfUsernames", username);
        const document = await getDoc(documentRef);

        if (document.exists()) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error checking username existence:', error);
    }
}

export function getUsername(): string {
    const userDocString = localStorage.getItem("user-doc");
    if (userDocString) {
        const userDoc = JSON.parse(userDocString);
        return userDoc.username;
    }
    return "";
}

export function getFirstname(): string {
    const userDocString = localStorage.getItem("user-doc");
    if (userDocString) {
        const userDoc = JSON.parse(userDocString);
        return userDoc.firstname;
    }
    return "";
}

export function getProfilePicURL(): string {
    const userDocString = localStorage.getItem("user-doc");
    if (userDocString) {
        const userDoc = JSON.parse(userDocString);
        return userDoc.profilePicURL;
    }
    return "";
}