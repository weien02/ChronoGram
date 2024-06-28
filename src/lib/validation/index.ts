import {z} from "zod";

export const SignUpValidation = z.object({
    email: z.string().email({message: 'Invalid email address!'}),
    firstName: z.string().min(1, {message: 'First name must not be empty!'}),
    username: z.string().min(1, { message: 'Username must not be empty!' })
        .regex(/^\S*$/, { message: 'Username must not contain spaces!' }),
    password: z.string().min(8, {message: 'Password must contain at least 8 characters!'}),
})

export const SignInValidation = z.object({
    email: z.string().email({message: 'Invalid email address!'}),
    password: z.string().min(1, { message: 'Please enter your password!' }),
});

export const ResetPasswordValidation = z.object({
    email: z.string().email({message: 'Invalid email address!'}),
});

export const EditProfileValidation = z.object({
    profilePic: z.string(),
    firstName: z.string(),
    username: z.string().regex(/^\S*$/, { message: 'Username must not contain spaces!' }),
});
