import { auth, db } from "@/lib/firebase/config";
import { doc, setDoc } from "firebase/firestore";
import useAuthState from "@/states/authState";
import { usernameAlreadyExists } from "../authFunctions";
import { useToast } from "@/components/ui/use-toast";
import { createUserWithEmailAndPassword } from "firebase/auth";


export function useSignUp() {
    
    const { toast } = useToast();
    const emailAlreadyTaken = "Firebase: Error (auth/email-already-in-use).";
    const signInUser = useAuthState((state) => state.signin);

    async function signup(values: {
        email?: string;
        firstName?: string;
        username?: string;
        password?: string;
    }) {
        const exists = await usernameAlreadyExists(values.username);
        if (!exists) {
            try {
                const newUser = await createUserWithEmailAndPassword(auth, values.email, values.password);
               
                const userDoc = {
                    uid: newUser.user.uid,
                    email: values.email,
                    username: values.username,
                    firstname: values.firstName,
                    profilePicURL: "",
                    lockedCapsules: [],
                    unlockedCapsules: [],
                    createdAt: Date.now()
                }
                setDoc(doc(db, "users", newUser.user.uid), userDoc);
                setDoc(doc(db, "listOfUsernames", values.username), {uid: newUser.user.uid});
                localStorage.setItem("user-doc", JSON.stringify(userDoc));
                signInUser(userDoc);
                toast({
                    variant: "success",
                    title: "Sign up successful!",
                    description: "Welcome to ChronoGram, " + values.firstName + "!",
                  });
                   
            } catch(error) {
                if (error.message === emailAlreadyTaken) {
                    toast({
                        variant: "destructive",
                        title: "Sign up unsuccessful.",
                        description: "An existing account is already using the same email address. Please try another.",
                      });
                } else {
                    toast({
                        variant: "destructive",
                        title: "Unexpected error.",
                        description: error.message,
                      });
                }   
            }       
        } else {
            toast({
                variant: "destructive",
                title: "Sign up unsuccessful.",
                description: "An existing account is already using the same username. Please try another.",
            });
        }  
    }
    
    return { signup };
}

export default useSignUp;