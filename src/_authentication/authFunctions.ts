import { db } from "@/lib/firebase/config";
import { doc, getDoc } from "firebase/firestore";


/*export async function signIn(values) {
    signInWithEmailAndPassword(auth, values.email, values.password)
    .then(() => {
    alert("Sign in successful. Welcome back!");
    )
    .catch((error) => {
    if (error.message === "Firebase: Error (auth/invalid-credential).") {
    alert("Incorrect email address or password. Please try again.");
        } else {
    alert(error.message);
        }
    });
}*/

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