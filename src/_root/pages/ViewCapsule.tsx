import TimeTunnelCard from "@/components/capsules/TimeTunnelCard";
import { useToast } from "@/components/ui/use-toast";
import { db } from "@/lib/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

function ViewCapsule() {

  const { toast } = useToast();
  const { capsuleId } = useParams();
  const [isRetrieving, setIsRetrieving] = useState(true);
  const [capsuleDoc, setCapsuleDoc] = useState(null);
  const navigate = useNavigate();

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
                <h2 className="h3-bold md:h2-bold text-left w-full">View Capsule</h2>
            </div>
            <div className="w-full max-w-5xl">
                <button className="flex items-center sharedWith-link mb-8" onClick={() => navigate(-1)}>
                    <img
                        src="/assets/glyphs/back.png"
                        className="h-6 w-6 mr-2"
                    />
                    Back
                </button>
                {isRetrieving ? (
                    <p>Loading...</p>
                    ) : (
                    <TimeTunnelCard capsule={capsuleDoc} />
                )}
            </div>
            <p className="small-regular text-center mt-6">
                Want to view more capsules?
                <Link to="/time-tunnel" className="text-primary-600 underline ml-1">Go to Time Tunnel</Link>
            </p>
        </div>
    </div>    
  );
}

export default ViewCapsule;