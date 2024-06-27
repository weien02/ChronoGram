import { useToast } from "@/components/ui/use-toast";
import { db } from "@/lib/firebase/config";
import useCapsuleState from "@/states/capsuleState";
import { doc, updateDoc } from "firebase/firestore";

function useDeleteComment() {
    const { toast } = useToast();
    const fetchCapsules = useCapsuleState((state) => state.fetchCapsules);

    async function deleteComment(capsuleId, commentId, comments) {
        try {
            const newComments = comments.filter(x => x.commentId !== commentId);
            const capsuleDocRef = doc(db, "capsules", capsuleId);
            await updateDoc(capsuleDocRef, { comments: newComments });
            fetchCapsules();
            toast({
                variant: "success",
                title: "Reflection deleted!",
                description: "Your reflection has been deleted successfully!",
            });

        } catch (error) {
            toast({
                variant: "destructive",
                title: "Unexpected error.",
                description: error.message,
            });
        }
    }
    return { deleteComment };
}

export default useDeleteComment;