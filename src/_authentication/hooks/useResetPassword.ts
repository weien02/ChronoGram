import { auth } from "@/lib/firebase/config";
import { sendPasswordResetEmail } from "firebase/auth";


function useResetPassword() {

    async function resetPassword(email?: string) {
        try {
			await sendPasswordResetEmail(auth, email);
		} catch (error) {
			throw error;
		}
    }
    return { resetPassword };
}

export default useResetPassword;