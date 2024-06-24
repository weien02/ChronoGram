import { auth, db } from "@/lib/firebase/config";
import useAuthState from "@/states/authState";
import { useToast } from "@/components/ui/use-toast";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import useCapsuleState from "@/states/capsuleState";


export function useSignIn() {
    
    const invalidCred = "Firebase: Error (auth/invalid-credential).";
    const { toast } = useToast();
    const signInUser = useAuthState((state) => state.signin);
    const fetchCapsules = useCapsuleState((state) => state.fetchCapsules);

    async function signin(values: {
      email?: string;
      password?: string;
    }) {
        try {
          const currUser = await signInWithEmailAndPassword(auth, values.email, values.password);
          const docRef = doc(db, "users", currUser.user.uid);
				  const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const userDoc = docSnap.data();
            localStorage.setItem("user-doc", JSON.stringify(userDoc));
            signInUser(userDoc);
            fetchCapsules();
            toast({
              variant: "success",
              title: "Sign in successful!",
              description: "Welcome back, " + userDoc.firstname + "!",
            });
          } else {
            toast({
              variant: "destructive",
              title: "Sign in unsuccessful.",
              description: "docSnap does not exist. Please report this to the ChronoGram team!",
            });
          }
		    } catch (error) {
          if (error.message === invalidCred) {
            toast({
              variant: "destructive",
              title: "Sign in unsuccessful.",
              description: "Incorrect email address/password. Please try again.",
            });
          } else {
            toast({
              variant: "destructive",
              title: "Unexpected error.",
              description: error.message,
            });
          }
		    }
    }
    
    return { signin };
}

export default useSignIn;