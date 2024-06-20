import { useToast } from "@/components/ui/use-toast";
import { db } from "@/lib/firebase/config";
import { doc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function useDeclineShare() {
  const { toast } = useToast();
  const navigate = useNavigate();

  async function declineShare(capsuleId, users, index) {
    users.splice(index, 1);

    try {
      const capsuleDocRef = doc(db, "capsules", capsuleId);
      await updateDoc(capsuleDocRef, {sharedWith: users,});
      toast({
        variant: "success",
        title: "Decline share successful!",
        description: "Share has been declined successfully!",
      });
      
      setTimeout(() => {
        navigate(-1);
        window.location.reload();

      }, 2000);
      


    } catch (error) {
      toast({
        variant: "destructive",
        title: "Unexpected error.",
        description: error.message,
      });
      
    }
  }
  return { declineShare };

}

export default useDeclineShare;