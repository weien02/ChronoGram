import { auth } from "@/lib/firebase/config";
import useAuthState from "@/states/authState";
import { signOut } from "firebase/auth";
import { useToast } from "@/components/ui/use-toast";
import useCapsuleState from "@/states/capsuleState";

function useSignOut() {
    const signOutUser = useAuthState((state) => state.signout);
    const clearPermittedCapsules = useCapsuleState((state) => state.clearPermittedCapsules);
    const { toast } = useToast();
    async function signout() {
        try {
          await signOut(auth);
          localStorage.removeItem("user-doc");
          localStorage.removeItem("capsules");
          signOutUser();
          clearPermittedCapsules();
            toast({
              variant: "success",
              title: "Sign out successful!",
              description: "See you again soon!",
            })
          } catch (error) {
            toast({
                      variant: "destructive",
                      title: "Unexpected error.",
                      description: error.message,
                    });
          }
    }
    return { signout };
}

export default useSignOut;