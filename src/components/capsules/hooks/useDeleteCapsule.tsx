import { getUid } from "@/_authentication/authFunctions";
import { useToast } from "@/components/ui/use-toast";
import { db, storage } from "@/lib/firebase/config";
import useCapsuleState from "@/states/capsuleState";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useNavigate } from "react-router-dom";

function useDeleteCapsule() {

  const {toast} = useToast();
  const navigate = useNavigate();
  const fetchCapsules = useCapsuleState((state) => state.fetchCapsules);
  
  async function deleteCapsule(capsuleId, images, audios) {
    try {
      const userDocRef = doc(db, "users", getUid());
      const userDoc = await getDoc(userDocRef);
      const userData = userDoc.data();
      const capsules = userData.capsules;
      const newCapsules = capsules.filter(x => x !== capsuleId);
      await updateDoc(userDocRef, {capsules: newCapsules});

      for (let i = 0; i < images.length; i++) {
        const desertRef = ref(storage, `capsules/${capsuleId}/images/${images[i]}`);
          deleteObject(desertRef).then(() => {
            console.log("Image deleted.");
          }).catch((error) => {
            toast({
              variant: "destructive",
              title: "Unexpected error.",
              description: error.message,
            });
          });
      }

      for (let i = 0; i < audios.length; i++) {
        const desertRef = ref(storage, `capsules/${capsuleId}/audios/${audios[i]}`);
          deleteObject(desertRef).then(() => {
            console.log("Audio deleted.");
          }).catch((error) => {
            toast({
              variant: "destructive",
              title: "Unexpected error.",
              description: error.message,
            });
          });
      }

      await deleteDoc(doc(db, "capsules", capsuleId));

      toast({
        variant: "success",
        title: "Delete successful!",
        description: "Time capsule has been deleted successfully!",
      });

      fetchCapsules();
      setTimeout(() => {
        navigate(-1);
      }, 500);

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Unexpected error.",
        description: error.message,
      });
    }
  }

  return { deleteCapsule };
}

export default useDeleteCapsule;