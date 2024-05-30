import {z} from "zod";
import { db } from "../firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";

export const SignUpValidation = z.object({
    email: z.string().email({message: 'Invalid email address!'}),
    firstName: z.string().min(1, {message: 'First name must not be empty!'}),
    username: z.string().min(2, {message: 'Username must contain at least 2 characters!'}),
    password: z.string().min(8, {message: 'Password must contain at least 8 characters!'}),
})

export const SignInValidation = z.object({
    email: z.string().email({message: 'Invalid email address!'}),
    password: z.string().max(128, {message: 'Invalid input!'}),
  });


