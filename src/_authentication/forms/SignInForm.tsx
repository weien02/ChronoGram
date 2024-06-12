import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import { SignInValidation } from "@/lib/validation";
import { Link } from "react-router-dom";
import useSignIn from "../hooks/useSignIn";


function SignInForm() {


    const form = useForm<z.infer<typeof SignInValidation>>({
        resolver: zodResolver(SignInValidation),
        defaultValues: {
            email: "",
            password: "",
        },
    })
 
    const { signin } = useSignIn();
    async function onSubmit(values: z.infer<typeof SignInValidation>) {
        signin(values);
    } 

    return (
        <Form {...form}>
          <div className="sm:w-429=0 flex-center flex-col">

            <div className="flex items-center">
              <img src="assets/icon/Icon-60@2x.png" alt="logo" className="mr-5" style={{ width: '75px', height: '75px' }}/>
              <h1 className="h1-bold">ChronoGram</h1>
            </div>

            <h2 className="h3-bold md:h2-bold pt-5 sm:pt-9">
              Sign In
            </h2>

            <p className="hidden sm:block text-dark-1 small-medium md:base-regular mt-2">
              Sign in to create, view and share your own time capsules today!
            </p>

            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                  <FormItem>
                    <FormLabel className="body-bold">Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" className="shad-input" {...field} />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                  <FormItem>
                    <FormLabel className="body-bold">Password</FormLabel>
                      <FormControl>
                        <Input type="password" className="shad-input" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="shad-button_primary">
                  Sign In
                </Button>

                <p className="small-regular text-center mt-6">
                  Forgot your password?
                  <Link to="/reset-password" className="text-primary-600 underline ml-1">Reset password</Link>
                </p>

                <p className="small-regular text-center">
                  Don't have an account?
                  <Link to="/sign-up" className="text-primary-600 underline ml-1">Sign up</Link>
                </p>
            </form>
          </div>
        </Form>
        
    );
}

export default SignInForm;