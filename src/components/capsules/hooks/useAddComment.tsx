import { getUid } from "@/_authentication/authFunctions";
import { useToast } from "@/components/ui/use-toast";
import { db } from "@/lib/firebase/config";
import useCapsuleState from "@/states/capsuleState";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';


function useAddComment() {
    const { toast } = useToast();
    const fetchCapsules = useCapsuleState((state) => state.fetchCapsules);

    async function addComment(capsuleId, comment, creator) {
        try {
            const commentDoc = {
                commentId: uuidv4(),
                createdBy: getUid(),
                createdAt: Date.now(),
                comment: comment,
                creator: creator,
            }
            const capsuleDocRef = doc(db, "capsules", capsuleId);
            await updateDoc(capsuleDocRef, { comments: arrayUnion(commentDoc) });
            fetchCapsules();
            toast({
                variant: "success",
                title: "Reflection posted!",
                description: "Your reflection has been posted successfully!",
            });

        } catch (error) {
            toast({
                variant: "destructive",
                title: "Unexpected error.",
                description: error.message,
            });
        }
    }
    return { addComment };
}

export default useAddComment;