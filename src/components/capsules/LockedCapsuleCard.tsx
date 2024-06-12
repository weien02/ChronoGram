import { Card, CardHeader, CardContent } from "@/components/ui/card";
import lockIcon from "/assets/glyphs/lock.png"; 
import UserBadge from "./UserBadge";
import { db } from "@/lib/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { useToast } from "../ui/use-toast";
import { useEffect, useState } from 'react';

function LockedCapsuleCard({ id }) {
  const { toast } = useToast();
  const [capsuleDoc, setCapsuleDoc] = useState(null);

  useEffect(() => {
    async function getCapsule(id) {
      try {
        const docRef = doc(db, "capsules", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const capsuleData = docSnap.data();
          setCapsuleDoc(capsuleData);
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Unexpected error.",
          description: error.message,
        });
      }
    }

    getCapsule(id);
  }, [id]);

  if (!capsuleDoc) {
    return <div>Capsule not found</div>;
  }

  const unlockDate = capsuleDoc.unlockDate;

  return (
    <Card className="bg-light-1 w-full">
      <CardHeader className="flex flex-col items-start">
        <UserBadge uid={capsuleDoc.createdBy} index={1} />
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <h2 className="base-semibold">{capsuleDoc.title}</h2>
        <img src={lockIcon} alt="lock icon" className="h-8 w-8 mt-4" />
        <div className="flex items-center mt-2">
          <span className="h3-bold">{Math.ceil(Math.abs(new Date(unlockDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))}</span>
          <p className="small-regular ml-2">Days to Unlock</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default LockedCapsuleCard;
