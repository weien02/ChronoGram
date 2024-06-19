import { getFirstname, getProfilePicURL, getUsername } from "@/_authentication/authFunctions";
import { auth, db } from "@/lib/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

function UserBadge({ uid, index }) {
    const [profilePicURL, setProfilePicURL] = useState("");
    const [firstname, setFirstname] = useState("");
    const [username, setUsername] = useState("");
    const currentUser = auth.currentUser && auth.currentUser.uid === uid;
  
    useEffect(() => {
      const fetchData = async () => {
        if (!currentUser) {
          try {
            const profilePicURL = await searchProfilePicURL(uid);
            const firstname = await searchFirstname(uid);
            const username = await searchUsername(uid);
            setProfilePicURL(profilePicURL);
            setFirstname(firstname + (index === 0 ? " (Creator)" : ""));
            setUsername(username);
          } catch (error) {
            console.error("Error fetching user data:", error);
          }
        } else {
          setProfilePicURL(getProfilePicURL());
          setFirstname(getFirstname() + (index === 0 ? " (Creator)" : ""));
          setUsername(getUsername());
        }
      };
  
      fetchData();
    }, []);
  
    const searchProfilePicURL = async (uid) => {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      const userDoc = docSnap.data();
      return userDoc.profilePicURL;
    };
  
    const searchFirstname = async (uid) => {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      const userDoc = docSnap.data();
      return userDoc.firstname;
    };
  
    const searchUsername = async (uid) => {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      const userDoc = docSnap.data();
      return userDoc.username;
    };
  
    return (
      <div className="flex gap-3 items-center">
        <img
          src={profilePicURL}
          alt="profile"
          className="h-12 w-12 rounded-full"
        />
        <div className="flex flex-col text-left">
          <p className="base-semibold">{firstname}</p>
          <p className="small-regular text-primary-600">@{username}</p>
        </div>
      </div>
    );
}

export default UserBadge;