import { useToast } from "@/components/ui/use-toast";
import { db, storage } from "@/lib/firebase/config";
import useCapsuleState from "@/states/capsuleState";
import { doc, updateDoc } from "firebase/firestore";
import { deleteObject, ref, uploadString } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';

function useEditCapsule() {
  
    const { toast } = useToast();
    const fetchCapsules = useCapsuleState((state) => state.fetchCapsules);
    const navigate = useNavigate();

    function isDataURL(str) {
        const regex = /^\s*data:([a-zA-Z]+\/[a-zA-Z0-9\-\+\.]+)?(;base64)?,[a-zA-Z0-9!$&',()*+;=\-._~:@\/?%\s]*\s*$/;
        return regex.test(str);
    }

    async function editCapsule(values: {

        capsuleId?: string,
        title?: string,
        unlockDate?: Date,
        notes?: string[],
        images?: string[],
        audios?: string[],
        sharedWith?: string[],
        locked?: boolean,
        deletedImages?: string[],
        deletedAudios?: string[],
        forceUnlock?: boolean,

    }) {

        try {
            const capsuleDocRef = doc(db, "capsules", values.capsuleId);
            const uploadedImages = values.images;
            const uploadedAudios = values.audios;
            
            await updateDoc(capsuleDocRef, {
                title: values.title,
                unlockDate: (values.forceUnlock) ? Date.now() : values.unlockDate.getTime(),
                notes: values.notes,
                sharedWith: values.sharedWith,
                locked: values.locked,
            });

            
            //Upload and update images array
            for (let i = 0; i < values.images.length; i++) {
                if (isDataURL(values.images[i])) {
                    const uuid = uuidv4();
                    // Create a unique reference for each image
                    const imageRef = ref(storage, `capsules/${capsuleDocRef.id}/images/${uuid}`);
                    await uploadString(imageRef, values.images[i], "data_url");
                    uploadedImages[i] = uuid;
                    console.log("Image upload success");
                }
            }
            //Update db doc
            await updateDoc(capsuleDocRef, { images: uploadedImages });

            //Delete images from storage
            for (let i = 0; i < values.deletedImages.length; i++) {
                const desertRef = ref(storage, `capsules/${capsuleDocRef.id}/images/${values.deletedImages[i]}`);
                deleteObject(desertRef).then(() => {
                    console.log("Image deleted.");
                  }).catch((error) => {
                    toast({
                        variant: "destructive",
                        title: "Unexpected error.",
                        description: error.message,
                    });
                  });
            }

            for (let i = 0; i < values.audios.length; i++) {
                if (isDataURL(values.audios[i])) {
                    const uuid = uuidv4();
                    // Create a unique reference for each audio file
                    const audioRef = ref(storage, `capsules/${capsuleDocRef.id}/audios/${uuid}`);
                    await uploadString(audioRef, values.audios[i], "data_url");
                    uploadedAudios[i] = uuid;
                    console.log("Audio upload success");
                }
            }
            //Update db doc
            await updateDoc(capsuleDocRef, { audios: uploadedAudios });

            //Delete audio from storage
            for (let i = 0; i < values.deletedAudios.length; i++) {
                const desertRef = ref(storage, `capsules/${capsuleDocRef.id}/audios/${values.deletedAudios[i]}`);
                deleteObject(desertRef).then(() => {
                    console.log("Audio deleted.");
                  }).catch((error) => {
                    toast({
                        variant: "destructive",
                        title: "Unexpected error.",
                        description: error.message,
                    });
                  });
            }

            toast({
                variant: "success",
                title: "Capsule update successful!",
                description: "Time capsule has been updated successfully!",
            });

            fetchCapsules();
            setTimeout(() => {
                navigate(-1);
            }, 500);

        } catch (error) {
            toast({
                variant: "destructive",
                title: "Unexpected error.",
                description: error.message,
            });
        }

    }

    return { editCapsule };
  
}

export default useEditCapsule;