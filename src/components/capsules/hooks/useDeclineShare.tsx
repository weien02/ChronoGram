import { getUid } from "@/_authentication/authFunctions";
import { useToast } from "@/components/ui/use-toast";
import { db } from "@/lib/firebase/config";
import useCapsuleState from "@/states/capsuleState";
import { doc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function useDeclineShare() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const fetchCapsules = useCapsuleState((state) => state.fetchCapsules);

  async function declineShare(capsuleId, users, type) {
    const newUsers = users.filter(x => x != getUid())

    try {
      const capsuleDocRef = doc(db, "capsules", capsuleId);
      await updateDoc(capsuleDocRef, {sharedWith: newUsers,});

      fetchCapsules();
        if (type === 0) {
        setTimeout(() => {
          navigate(-1);
        }, 500);
      }

      toast({
        variant: "success",
        title: "Decline share successful!",
        description: "Share has been declined successfully!",
      });

      
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