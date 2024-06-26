import { Card, CardHeader, CardContent } from "@/components/ui/card";
import lockIcon from "/assets/glyphs/lock.png"; 
import UserBadge from "./UserBadge";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { getUid } from "@/_authentication/authFunctions";
import useDeclineShare from "./hooks/useDeclineShare";

function LockedCapsuleCard({ capsule }) {
  
  const navigate = useNavigate();
  const { declineShare } = useDeclineShare();

  if (!capsule) {
    return <div>Capsule not found</div>;
  }

  const unlockDate = capsule.unlockDate;

  function howManyDaysAgo() {
    const timing = Math.abs(new Date(unlockDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    return Math.ceil(timing);
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Card className="bg-light-1 w-full sidebar-link">
        <CardHeader className="flex flex-col items-start">
          <UserBadge uid={capsule.createdBy} index={1} />
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <h2 className="base-semibold text-center">{capsule.title}</h2>
          <img src={lockIcon} alt="lock icon" className="h-8 w-8 mt-4" />
          <p className="justify-center mt-2 small-regular">{format(new Date(capsule.unlockDate), 'do MMMM yyyy')}</p>
          <div className="flex items-center">
            <span className="h3-bold">{howManyDaysAgo()}</span>
            <p className="small-regular ml-2">Day{howManyDaysAgo() === 1 ? "" : "s"} to Unlock</p>
          </div>
        </CardContent>
      </Card>
      </PopoverTrigger>
      <PopoverContent className="bg-light-3 w-full">
        { capsule.createdBy === getUid()
        
        ? (<Button className="shad-button_primary" onClick={() => navigate(`/edit-capsule/${capsule.capsuleId}`)}>Edit Capsule</Button>)
        
        : (<AlertDialog>
            <AlertDialogTrigger>
                <Button
                    type="button"
                    className="shad-button_destructive"
                >
                    Decline Share
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-light-4">
                <AlertDialogHeader>
                    <AlertDialogTitle>Decline Share?</AlertDialogTitle>
                    <AlertDialogDescription>
                        You will no longer be able to view this time capsule.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => declineShare(capsule.capsuleId, capsule.sharedWith, 1)}>Confirm</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>)
        }
        
      </PopoverContent>
    </Popover>
  );
}

export default LockedCapsuleCard;
