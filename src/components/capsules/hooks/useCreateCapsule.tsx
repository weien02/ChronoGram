import { getUid } from "@/_authentication/authFunctions";
import { useToast } from "@/components/ui/use-toast";
import { db, storage } from "@/lib/firebase/config";
import { addDoc, arrayUnion, collection, doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";

function useCreateCapsule() {
  
    const { toast } = useToast();

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
            likes: [],
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
            
            //Upload and update images array
            for (let i = 0; i < values.images.length; i++) {
                // Create a unique reference for each image
                const imageRef = ref(storage, `capsules/${capsuleDocRef.id}/images/image${i}`);
                await uploadString(imageRef, values.images[i], "data_url");
                const downloadURL = await getDownloadURL(imageRef);
                uploadedImages.push(downloadURL);
                console.log("Attempted image upload");
            }
            //Update db doc
            await updateDoc(capsuleDocRef, { images: uploadedImages });

            for (let i = 0; i < values.audios.length; i++) {
                // Create a unique reference for each audio file
                const audioRef = ref(storage, `capsules/${capsuleDocRef.id}/audios/audio${i}`);
                await uploadString(audioRef, values.audios[i], "data_url");
                const downloadURL = await getDownloadURL(audioRef);
                uploadedAudios.push(downloadURL);
                console.log("Attempted audio upload");
            }
            //Update db doc
            await updateDoc(capsuleDocRef, { audios: uploadedAudios });

            toast({
                variant: "success",
                title: "Capsule creation successful!",
                description: "Time capsule has been created successfully!",
            });

            setTimeout(() => {
                window.location.reload();
              }, 2000);

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