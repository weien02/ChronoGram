import { Card, CardHeader, CardContent } from "@/components/ui/card";
import UserBadge from "./UserBadge";
import { useNavigate } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { getUid } from "@/_authentication/authFunctions";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import useDeclineShare from "./hooks/useDeclineShare";

function PendingCapsuleCard({ capsule }) {
  
  const navigate = useNavigate();
  const { declineShare } = useDeclineShare();

  if (!capsule) {
    return <div>Capsule not found</div>;
  }


  return (
    <Popover>
      <PopoverTrigger asChild>
        <Card className="bg-light-1 w-full  sidebar-link">
          <CardHeader className="flex flex-col items-start">
            <UserBadge uid={capsule.createdBy} index={1} />
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <h2 className="base-semibold text-center">{capsule.title}</h2>
          </CardContent>
        </Card>
      </PopoverTrigger>
      <PopoverContent className="bg-light-3 w-full flex flex-col items-center justify-center">
        <Button className="shad-button_primary" onClick={() => navigate(`/edit-capsule/${capsule.capsuleId}`)}>Edit Capsule</Button>
          {capsule.createdBy !== getUid() && (
              <AlertDialog>
                  <AlertDialogTrigger>
                      <Button
                          type="button"
                          className="shad-button_destructive mt-2"
                      >
                          Decline Share
                      </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-light-4">
                      <AlertDialogHeader>
                          <AlertDialogTitle>Decline Share?</AlertDialogTitle>
                          <AlertDialogDescription>
                              You will no longer be able to view or edit this time capsule.
                          </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => declineShare(capsule.capsuleId, capsule.sharedWith, 1)}>Confirm</AlertDialogAction>
                      </AlertDialogFooter>
                  </AlertDialogContent>
              </AlertDialog>
          )}
      </PopoverContent>
    </Popover>
  );
}

export default PendingCapsuleCard;