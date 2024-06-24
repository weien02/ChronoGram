import { Card, CardHeader, CardContent } from "@/components/ui/card";
import UserBadge from "./UserBadge";
import { useNavigate } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";

function PendingCapsuleCard({ capsule }) {
  
  const navigate = useNavigate();

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
            <h2 className="base-semibold">{capsule.title}</h2>
          </CardContent>
        </Card>
      </PopoverTrigger>
      <PopoverContent className="bg-light-3 w-full">
        <Button className="shad-button_primary" onClick={() => navigate(`/edit-capsule/${capsule.capsuleId}`)}>Edit Capsule</Button>
      </PopoverContent>
    </Popover>
  );
}

export default PendingCapsuleCard;