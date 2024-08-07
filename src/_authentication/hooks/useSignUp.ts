import { auth, db } from "@/lib/firebase/config";
import { doc, setDoc } from "firebase/firestore";
import useAuthState from "@/states/authState";
import { usernameAlreadyExists } from "../authFunctions";
import { useToast } from "@/components/ui/use-toast";
import { createUserWithEmailAndPassword } from "firebase/auth";
import useCapsuleState from "@/states/capsuleState";


export function useSignUp() {
    
    const { toast } = useToast();
    const emailAlreadyTaken = "Firebase: Error (auth/email-already-in-use).";
    const signInUser = useAuthState((state) => state.signin);
    const fetchCapsules = useCapsuleState((state) => state.fetchCapsules);

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
                    profilePicURL: "/assets/glyphs/user.png",
                    capsules: [],
                    createdAt: Date.now(),
                    achievements: [false, false, false, false, false],
                }
                
                setDoc(doc(db, "users", newUser.user.uid), userDoc);
                setDoc(doc(db, "listOfUsernames", values.username), {uid: newUser.user.uid});
                localStorage.setItem("user-doc", JSON.stringify(userDoc));
                signInUser(userDoc);
                fetchCapsules();
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