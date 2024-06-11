import { Card, CardHeader, CardContent } from "@/components/ui/card";
import lockIcon from "/assets/glyphs/lock.png"; 
import UserBadge from "./UserBadge";
import { getUid } from "@/_authentication/authFunctions";

const LockedCapsuleCard = () => {
  return (
    <Card className="bg-light-1 w-full">
      <CardHeader className="flex flex-col items-start">
        <UserBadge uid={getUid()} index={1} />
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <h2 className="base-semibold">Time Capsule Title</h2>
        <img src={lockIcon} alt="lock icon" className="h-8 w-8 mt-4" />
        <div className="flex items-center mt-2">
          <span className="h3-bold">X</span>
          <p className="small-regular ml-2">Days to Unlock</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LockedCapsuleCard;