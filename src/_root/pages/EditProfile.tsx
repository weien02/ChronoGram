import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import { EditProfileValidation } from "@/lib/validation";
import { getFirstname, getProfilePicURL, getUsername } from "@/_authentication/authFunctions";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import useEditProfile from "@/_authentication/hooks/useEditProfile";

function EditProfile() {
  const form = useForm<z.infer<typeof EditProfileValidation>>({
    resolver: zodResolver(EditProfileValidation),
    defaultValues: {
      profilePic: "",
      firstName: "",
      username: "",
    },
  });

  const { toast } = useToast();
  const { editProfile } = useEditProfile();
  const [imagePreview, setImagePreview] = useState(getProfilePicURL());

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size <= 2 * 1024 * 1024) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        }
        reader.readAsDataURL(file);
      } else {
        toast({
          variant: "destructive",
          title: "File size too large.",
          description: "File must be less than 2MB.",
        });
      }
    }
  };

  async function onSubmit(values: z.infer<typeof EditProfileValidation>) {
    if (values.username === getUsername()) {
      values.username = "";
    }
    if (values.firstName = getFirstname()) {
      values.firstName = "";
    }
    if (values.username === "" && values.firstName === "" && values.profilePic === "") {
      console.log("No changes to save.")
      return;
    }
    return editProfile(values);
  } 

  return (

    <div className="flex flex-1">
      <div className="common-container">
        <div className="flex-start gap-3 justify-start w-full max-w-5xl">
          <h2 className="h3-bold md:h2-bold text-left w-full">Edit Profile</h2>
        </div>
        <Form {...form}>

          <div className="sm:w-429=0 flex-center flex-col">
            <p className="body-bold pt-5 sm:pt-9">
              Enter and save your updated profile details below.
            </p>
            
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-6">
              
              <FormField
                control={form.control}
                name="profilePic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="shad-form_label">Profile Picture</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-4">
                        <input type="file" accept="image/*" onChange={handleImageChange} />
                        {imagePreview && (
                          <img src={imagePreview} alt="Profile Preview" className="h-16 w-16 rounded-full" />
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
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
                      <Input
                        type="text"
                        className="shad-input"
                        placeholder={getFirstname()}
                        {...field} />
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
                      <Input
                        type="text"
                        className="shad-input"
                        placeholder={getUsername()}
                        {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex mt-4 gap-4 items-center justify-start">
                
                <AlertDialog>
                  <AlertDialogTrigger>
                    <Button
                      type="button"
                      className="shad-button_dark_4">
                      Discard Changes
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-light-4">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Discard edits?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Your edits will not be saved.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => window.location.reload()}>Confirm Discard</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <Button
                  type="submit"
                  className="shad-button_primary"
                  onClick={() => {
                    if (imagePreview !== getProfilePicURL()) {
                      form.setValue("profilePic", imagePreview);
                    }
                  }}>
                  Save Changes
                </Button>
              </div>

            </form>
          </div>

        </Form>
      </div>
    </div>
  );

}

export default EditProfile;