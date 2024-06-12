import { useToast } from "@/components/ui/use-toast";
import { db, storage } from "@/lib/firebase/config";
import { getFirstname, getProfilePicURL, getUid, getUsername, usernameAlreadyExists } from "../authFunctions";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { deleteDoc, doc, setDoc, updateDoc } from "firebase/firestore";
import useAuthState from "@/states/authState";

function useEditProfile() {
  
    const { toast } = useToast();
    const setAuthUser = useAuthState((state) => state.setUser);

    async function editProfile(values: {
        profilePic?: string;
        firstName?: string;
        username?: string;
    }) {

        const storageRef = ref(storage, `profilePics/${getUid()}`);
		const userDocRef = doc(db, "users", getUid());
        let newProfilePicURL = getProfilePicURL();

        const exists = values.username !== "" && await usernameAlreadyExists(values.username);
        if (!exists) {
            try {
                if (values.profilePic !== "") {
                    await uploadString(storageRef, values.profilePic, "data_url");
                    newProfilePicURL = await getDownloadURL(ref(storage, `profilePics/${getUid()}`));
                }

                if (values.username !== "") {
                    await deleteDoc(doc(db, "listOfUsernames", getUsername()));
                }

                const userDocString = localStorage.getItem("user-doc");
                const currentUserDoc = userDocString ? JSON.parse(userDocString) : {};

                const updatedUserDoc = {
                    ...currentUserDoc,
                    firstname: values.firstName === "" ? getFirstname() : values.firstName,
                    username: values.username === "" ? getUsername() : values.username,
                    profilePicURL: newProfilePicURL,
                }

                await updateDoc(userDocRef, updatedUserDoc);

                if (values.username !== "") {
                    setDoc(doc(db, "listOfUsernames", values.username), {uid: getUid()});
                }
                
                localStorage.setItem("user-doc", JSON.stringify(updatedUserDoc));
                setAuthUser(updatedUserDoc);
                toast({
                    variant: "success",
                    title: "Update successful!",
                    description: "Your profile has been updated successfully!",
                });
                setTimeout(() => {
                    window.location.reload();
                  }, 2000);

            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "Unexpected error.",
                    description: error.message,
                });
            }
        } else {
            toast({
                variant: "destructive",
                title: "Update unsuccessful.",
                description: "An existing account is already using the same username. Please try another.",
            });
        }
    }
    return { editProfile };

}

export default useEditProfile;