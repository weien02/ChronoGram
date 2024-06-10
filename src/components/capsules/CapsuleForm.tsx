import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Textarea } from "../ui/textarea";
import PhotoUploader from "./PhotoUploader";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { Input } from "../ui/input";
import { format } from "date-fns";
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
import { getUid, searchUid, usernameAlreadyExists } from "@/_authentication/authFunctions";
import { useState } from "react";
import { useToast } from "../ui/use-toast";
import UserBadge from "./UserBadge";

function CapsuleForm() {

    const [usernameInput, setUsernameInput] = useState("");
    const [users, setUsers] = useState<string[]>([getUid()]);
    const { toast } = useToast();

    async function handleAddUsername(usernameInput) {
      
      if (usernameInput === "") {
        return;
      }
      const exists = await usernameAlreadyExists(usernameInput);
      if (exists) {
        const userInput = await searchUid(usernameInput);
        if (users.includes(userInput)) {
          setUsernameInput("");
          toast({
            variant: "destructive",
            title: "Failed to add user.",
            description: "User has already been added!",
          });
          return;
        }
        setUsers([...users, userInput]);
        setUsernameInput("");
      } else {
        toast({
          variant: "destructive",
          title: "Failed to add user.",
          description: "User does not exists!",
        });
      }
    };

    const handleDeleteUser = (indexToDelete: number) => {
      setUsers((prevUsers) => {
        const updatedUsers = [...prevUsers];
        updatedUsers.splice(indexToDelete, 1);
        return updatedUsers;
      });
    };

    //placeholder start
    const formSchema = z.object({
        title: z.string().min(1, "Your capsule must have a title!"),
        caption: z.string(),
        images: z.array(z.any()),
        unlockDate: z.date({required_error: "Your capsule must have an unlocking date!"}),
        sharedWith: z.array(z.string()),
    });
      
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          title: "",
          caption: "",
          images: [],
          unlockDate: null,
          sharedWith: [getUid()],
        },
    });
    
    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values.sharedWith);
        console.log(users);

    }
    //placeholder end

    return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-9 w-full  max-w-5xl">

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Title</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Caption</FormLabel>
              <FormControl>
                <Textarea
                  className="shad-textarea"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Upload Photos</FormLabel>
              <FormControl>
                <PhotoUploader />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="unlockDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Set Unlocking Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild className="bg-light-1">
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "do MMMM yyyy")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-light-1" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date()
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sharedWith"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">
                Share
              </FormLabel>
              <FormControl>
                <div className="flex gap-2">
                  <Input
                    value={usernameInput}
                    placeholder="e.g. @chronogram, then click Add"
                    onChange={(e) => setUsernameInput(e.target.value)}
                    className="shad-input"
                  />
                  <Button type="button" onClick={() => {
                    if (usernameInput.length >= 2 && usernameInput.charAt(0) === "@") {
                      handleAddUsername(usernameInput.substring(1));
                    } else {
                      handleAddUsername(usernameInput);
                    }
                  }} className="shad-button_primary">
                    Add
                  </Button>
                </div>
              </FormControl>
              <ul className="w-full max-w-5xl">
                {users.map((uid, index) => (
                  <li key={index} className="mt-4 flex items-center justify-between">
                    <UserBadge uid={uid} index={index} />
                    {index > 0 && (
                      <div className="flex items-center justify-end">
                        <Button
                          type="button"
                          onClick={() => handleDeleteUser(index)}
                          className="shad-button_destructive"
                        >
                          Remove
                        </Button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <div className="flex gap-4 items-center justify-start">

          <AlertDialog>
            <AlertDialogTrigger>
              <Button
                type="button"
                className="shad-button_dark_4">
                Discard
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-light-4">
              <AlertDialogHeader>
                <AlertDialogTitle>Discard capsule?</AlertDialogTitle>
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
            onClick={() => form.setValue("sharedWith", users)}>
            Create *Does nothing*
          </Button>

        </div>
      </form>
    </Form>
  );
};

export default CapsuleForm;