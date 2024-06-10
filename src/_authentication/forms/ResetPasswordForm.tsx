import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import { ResetPasswordValidation } from "@/lib/validation";
import { Link } from "react-router-dom";
import useResetPassword from "../hooks/useResetPassword";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";


function ResetPasswordForm() {

    const { toast } = useToast();
    const [submitted, setSubmitted] = useState<boolean>(false);

    const form = useForm<z.infer<typeof ResetPasswordValidation>>({
        resolver: zodResolver(ResetPasswordValidation),
        defaultValues: {
            email: "",
        },
    })
 
    const { resetPassword } = useResetPassword();
    async function onSubmit(values: z.infer<typeof ResetPasswordValidation>) {
        try {
            await resetPassword(values.email);
            setSubmitted(true);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Unexpected error.",
                description: error.message,
              });
        } 
    } 

    return submitted
    ? (
        <>
        <div className="sm:w-429=0 flex-center flex-col">
            <div className="flex items-center">
                <img src="assets/icon/Icon-60@2x.png" alt="logo" className="mr-5" style={{ width: '75px', height: '75px' }}/>
                <h1 className="h1-bold">ChronoGram</h1>
            </div>

            <h2 className="h3-bold md:h2-bold pt-5 sm:pt-9">
                Reset Password
            </h2>
            <p className="text-dark-1 md:small-regular text-center mt-6">
                A password reset link has been sent to your email address.
                <Link to="/sign-in" className="text-primary-600 underline ml-1">Sign in</Link>
            </p>
        </div>
        </>
    )
    : (
        <Form {...form}>
          <div className="sm:w-429=0 flex-center flex-col">

            <div className="flex items-center">
              <img src="assets/icon/Icon-60@2x.png" alt="logo" className="mr-5" style={{ width: '75px', height: '75px' }}/>
              <h1 className="h1-bold">ChronoGram</h1>
            </div>

            <h2 className="h3-bold md:h2-bold pt-5 sm:pt-9">
              Reset Password
            </h2>

            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                  <FormItem>
                    <FormLabel className="shad-form_label">Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" className="shad-input" {...field} />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                  )}
                />

                <Button type="submit" className="shad-button_primary">
                  Send password reset email
                </Button>

                <p className="small-regular text-center mt-6">
                  Remembered your password?
                  <Link to="/sign-in" className="text-primary-600 underline ml-1">Sign in</Link>
                </p>
            </form>
          </div>
        </Form>    
    );
}

export default ResetPasswordForm;