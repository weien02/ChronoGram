import EditCapsuleForm from "@/components/capsules/EditCapsuleForm";
import { useToast } from "@/components/ui/use-toast";
import { db } from "@/lib/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function EditCapsule() {

  const { toast } = useToast();
  const { capsuleId } = useParams();
  const [isRetrieving, setIsRetrieving] = useState(true);
  const [capsuleDoc, setCapsuleDoc] = useState(null);

  useEffect(() => {
        const fetchData = async () => {
            try {
                const docRef = doc(db, "capsules", capsuleId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const capsuleData = docSnap.data();
                    setCapsuleDoc(capsuleData);
                    setIsRetrieving(false);
                } else {
                    toast({
                        variant: "destructive",
                        title: "Failed to find capsule.",
                        description: capsuleId + " does not exist!",
                      });
                }
                
            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "Failed to load capsule.",
                    description: error.message,
                  });
            }
        };
        fetchData();
    }, []);

  return (
    <div className="flex flex-1">
        <div className="common-container">
            <div className="max-w-5xl flex-start gap-3 justify-start w-full">
                <h2 className="h3-bold md:h2-bold text-left w-full">Edit Capsule</h2>
            </div>
            {isRetrieving ? (
                <p>Loading...</p>
                ) : (
                <EditCapsuleForm capsule={capsuleDoc} />
            )}
        </div>
    </div>    
  );
}

export default EditCapsule;