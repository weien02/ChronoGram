import Dashboard from "@/components/homepage/Dashboard";
import { auth } from "@/lib/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { useState } from "react";

function Home() {

    const [signedIn, setSignedIn] = useState(auth.currentUser ? true : false);

    //To check if user is signed in
    onAuthStateChanged(auth, (user) => {
        if (user) {
            setSignedIn(true);
        } else {
            setSignedIn(false);
        }
    });

    return (
        <div className="flex flex-1">
            <div className="common-container" style={{
                  overflowY: 'auto',
                }}>
                <div className="flex-start gap-3 justify-start w-full max-w-5xl">
                    <h2 className="h3-bold md:h2-bold text-left w-full">Home</h2>
                    <div>{signedIn ? auth.currentUser.uid : "null"}</div>
                </div>
                <Dashboard />
            </div>
        </div>    
    );
}

export default Home;
