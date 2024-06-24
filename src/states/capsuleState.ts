import { getUid } from "@/_authentication/authFunctions";
import { auth, db } from "@/lib/firebase/config";
import { collection, getDocs, query, where } from "firebase/firestore";
import { create } from "zustand";

export interface Capsule {
  audios: string[];
  capsuleId: string;
  comments: string[];
  createdAt: number;
  createdBy: string;
  images: string[];
  locked; boolean;
  notes: string[];
  sharedWith: string[];
  title: string;
  unlockDate: number;
}

export interface CapsuleState {
	permittedCapsules: Capsule[] | null;
	fetchCapsules: () => void;
  clearPermittedCapsules: () => void
}

const useCapsuleState = create<CapsuleState>((set) => ({
    permittedCapsules: JSON.parse(localStorage.getItem("capsules")),
    fetchCapsules: async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
            return;
        }
        const q = query(collection(db, "capsules"), where("sharedWith", "array-contains", getUid()));
        const querySnapshot = await getDocs(q);
        console.log("Query successful. Number of documents retrieved:", querySnapshot.size);
  
        const capsules = [];
        querySnapshot.forEach((doc) => {
          capsules.push(doc.data());
        });
        set({ permittedCapsules: capsules });
        localStorage.setItem("capsules", JSON.stringify(capsules));
  
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    },
    clearPermittedCapsules: () => set({ permittedCapsules: null })
  }));

export default useCapsuleState;