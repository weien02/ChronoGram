import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import { EditProfileValidation } from "@/lib/validation";
import { getFirstname, getUsername } from "@/_authentication/authFunctions";

function EditProfile() {
  const form = useForm<z.infer<typeof EditProfileValidation>>({
    resolver: zodResolver(EditProfileValidation),
    defaultValues: {
      firstName: getFirstname(),
      username: getUsername(),
    },
  });

  async function onSubmit(values: z.infer<typeof EditProfileValidation>) {
    return console.log(values);
  } 

  return (

    <div className="flex flex-1">
      <div className="common-container">
        <div className="flex-start gap-3 justify-start w-full max-w-5xl">
          <h2 className="h3-bold md:h2-bold text-left w-full">Edit Profile</h2>
        </div>
        <Form {...form}>

          <div className="sm:w-429=0 flex-center flex-col">
            <h2 className="h3-bold md:h2-bold pt-5 sm:pt-9">Edit Profile *Not working yet!*</h2>
            <p className="hidden sm:block text-dark-1 small-medium md:base-regular mt-2">
              Enter your updated profile details below.
            </p>
            
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-6">
              
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="shad-form_label">First Name</FormLabel>
                    <FormControl>
                      <Input type="text" className="shad-input" {...field} />
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
                    <FormControl>
                      <Input type="text" className="shad-input" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="shad-button_primary">Save Changes *Does nothing*</Button>
            
            </form>
          </div>

        </Form>
      </div>
    </div>
  );

}

export default EditProfile;