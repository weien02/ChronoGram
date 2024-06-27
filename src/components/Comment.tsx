import { getUid } from "@/_authentication/authFunctions";
import UserBadge from "./capsules/UserBadge";
import { Button } from "./ui/button";
import useDeleteComment from "./capsules/hooks/useDeleteComment";

function Comment({comment, capsuleId, otherComments}) {
    
    const { deleteComment } = useDeleteComment();
    
    return (
        <div className="comment-container p-4 border-b border-primary-500">
          <div className="flex justify-between items-center mb-2">
            <UserBadge uid={comment.createdBy} index={comment.creator ? 0 : 1} />
            {comment.createdBy === getUid() && (
                <Button className="shad-button_destructive" onClick={() => deleteComment(capsuleId, comment.commentId, otherComments)}>Delete</Button>
            )}
          </div>
          <div className="small-regular mt-4">
            {comment.comment}
          </div>
        </div>
      );
}

export default Comment;