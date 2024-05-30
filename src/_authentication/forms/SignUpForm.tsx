import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import { SignUpValidation } from "@/lib/validation";
import { Link } from "react-router-dom";
import { useSignUp } from "../hooks/useSignUp";

function SignUpForm() {
    
    const form = useForm<z.infer<typeof SignUpValidation>>({
        resolver: zodResolver(SignUpValidation),
        defaultValues: {
          email: "",
          firstName: "",
          username: "",
          password: "",
        },
    })
    const { signup } = useSignUp();
 
    async function onSubmit(values: z.infer<typeof SignUpValidation>) {
      return signup(values);
    } 

    return (
        <Form {...form}>
          <div className="sm:w-429=0 flex-center flex-col">

            <div className="flex items-center">
              <img src="assets/icon/Icon-60@2x.png" alt="logo" className="mr-5" style={{ width: '75px', height: '75px' }}/>
              <h1 className="h1-bold">ChronoGram</h1>
            </div>

            <h2 className="h3-bold md:h2-bold pt-5 sm:pt-9">
              Sign Up
            </h2>

            <p className="hidden sm:block text-dark-1 small-medium md:base-regular mt-2">
              Sign up to create, view and share your own time capsules today!
            </p>

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

                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="shad-form_label">First Name</FormLabel>
                      <FormControl>
                        <Input type="firstName" className="shad-input" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                  <FormItem>
                      <FormLabel className="shad-form_label">Username</FormLabel>
                      <p className="text-dark-1 small-medium">(This will be publicly visible.)</p>
                      <FormControl>
                        <Input type="username" className="shad-input" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                  <FormItem>
                    <FormLabel className="shad-form_label">Password</FormLabel>
                      <FormControl>
                        <Input type="password" className="shad-input" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="shad-button_primary">
                  Sign Up
                </Button>

                <p className="text-dark-1 md:small-regular text-center mt-6">
                  Already have an account?
                  <Link to="/sign-in" className="text-primary-600 underline ml-1">Sign in</Link>
                </p>
            </form>
          </div>
        </Form>
        
    );
}

export default SignUpForm;