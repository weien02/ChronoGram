import { getUid } from "@/_authentication/authFunctions";
import { useToast } from "@/components/ui/use-toast";
import { db, storage } from "@/lib/firebase/config";
import useCapsuleState from "@/states/capsuleState";
import { addDoc, arrayUnion, collection, doc, updateDoc } from "firebase/firestore";
import { ref, uploadString } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';

function useCreateCapsule() {
  
    const { toast } = useToast();
    const navigate = useNavigate();
    const fetchCapsules = useCapsuleState((state) => state.fetchCapsules);

    async function createCapsule(values: {
        
        title?: string,
        unlockDate?: Date,
        notes?: string[],
        images?: string[],
        audios?: string[],
        sharedWith?: string[],
        locked?: boolean,
    }) {
        const capsuleDoc = {
            title: values.title,
            unlockDate: values.unlockDate.getTime(),
            notes: values.notes,
            sharedWith: values.sharedWith,
            comments: [],
            createdBy: getUid(),
            createdAt: Date.now(),
            locked: values.locked,
        }

        try {
            const capsuleDocRef = await addDoc(collection(db, "capsules"), capsuleDoc);
            const userDocRef = doc(db, "users", getUid());
            const uploadedImages = [];
            const uploadedAudios = [];
            await updateDoc(userDocRef, { capsules: arrayUnion(capsuleDocRef.id) });
            await updateDoc(capsuleDocRef, {capsuleId: capsuleDocRef.id});
            
            //Upload and update images array
            for (let i = 0; i < values.images.length; i++) {
                const uuid = uuidv4();
                // Create a unique reference for each image
                const imageRef = ref(storage, `capsules/${capsuleDocRef.id}/images/${uuid}`);
                await uploadString(imageRef, values.images[i], "data_url");
                uploadedImages.push(uuid);
                console.log("Image upload success");
            }
            //Update db doc
            await updateDoc(capsuleDocRef, { images: uploadedImages });

            for (let i = 0; i < values.audios.length; i++) {
                const uuid = uuidv4();
                // Create a unique reference for each audio file
                const audioRef = ref(storage, `capsules/${capsuleDocRef.id}/audios/${uuid}`);
                await uploadString(audioRef, values.audios[i], "data_url");
                uploadedAudios.push(uuid);
                console.log("Audio upload success");
            }
            //Update db doc
            await updateDoc(capsuleDocRef, { audios: uploadedAudios });

            fetchCapsules();
            setTimeout(() => {
                navigate(-1);
            }, 500);

            toast({
                variant: "success",
                title: "Capsule creation successful!",
                description: "Time capsule has been created successfully!",
            });


        } catch (error) {
            toast({
                variant: "destructive",
                title: "Unexpected error.",
                description: error.message,
            });
        }

    }

    return { createCapsule };
  
}

export default useCreateCapsule;