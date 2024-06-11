import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Textarea } from "../ui/textarea";
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
import { useRef, useState } from "react";
import { useToast } from "../ui/use-toast";
import UserBadge from "./UserBadge";
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Switch } from "@/components/ui/switch"

function CreateCapsuleForm() {

    const [usernameInput, setUsernameInput] = useState("");
    const [users, setUsers] = useState<string[]>([getUid()]);
    const [images, setImages] = useState<string[]>([]);
    const { toast } = useToast();
    const nextButtonRef = useRef<HTMLButtonElement>(null);

    const handleImageChange = (e) => {
      const file = e.target.files?.[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages([...images, (reader.result as string)]);
      }
      reader.readAsDataURL(file);
      setTimeout(() => {
        // To scroll to the end of carousel
        for (let i = 0; i < images.length; i++) {
          nextButtonRef.current.click();
        }
      }, 500);
      
    };


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
        setTimeout(() => {
          const userList = document.getElementById("sharedWithList");
          userList.scrollTop = userList.scrollHeight;
        }, 500);
      } else {
        toast({
          variant: "destructive",
          title: "Failed to add user.",
          description: "User does not exist!",
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

    const formSchema = z.object({
        title: z.string().min(1, "Your capsule must have a title!"),
        caption: z.string(),
        images: z.array(z.any()),
        unlockDate: z.date({required_error: "Your capsule must have an unlocking date!"}),
        sharedWith: z.array(z.string()),
        locked: z.boolean()
    });
      
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          title: "",
          caption: "",
          images: [],
          unlockDate: null,
          sharedWith: [getUid()],
          locked: false,
        },
    });
    
    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values.locked);
    }

    return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-9 w-full max-w-5xl">

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="body-bold">Title</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
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
              <FormLabel className="body-bold">Set Unlocking Date</FormLabel>
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
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="body-bold">Caption</FormLabel>
              <div className="small-regular">(Caption will be hidden when time capsule is locked.)</div>
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
              <FormLabel className="body-bold">Upload Photos</FormLabel>
              <div className="small-regular">(Photos will be hidden when time capsule is locked.)</div>
              <FormControl>
                <input type="file" accept="image/*" onChange={handleImageChange}/>
              </FormControl>
              <div className="flex justify-center mt-4">
                <Carousel className="w-full max-w-xs">
                  <CarouselContent>
                    {images.length === 0 ? (
                      <CarouselItem className="bg-light-1 rounded-lg">
                        <div className="p-1 flex justify-center items-center h-40">
                          <p>No photos uploaded</p>
                        </div>
                      </CarouselItem>
                    ) : (
                      images.map((src, index) => (
                        <CarouselItem key={index}>
                          <div className="p-1">
                            <Card>
                              <CardContent className="carousel-image-wrapper">
                                <img src={src} alt={`Image ${index + 1}`} className="carousel-image rounded-lg" />
                              </CardContent>
                            </Card>
                          </div>
                          <div className="py-2 text-center text-sm text-muted-foreground">
                            Photo {index + 1} of {images.length}
                          </div>
                        </CarouselItem>
                      ))
                    )}
                  </CarouselContent>
                  <CarouselPrevious type="button"/>
                  <CarouselNext ref={nextButtonRef} type="button" />
                </Carousel>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sharedWith"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="body-bold">
                Share
              </FormLabel>
              <FormControl>
                <div className="flex gap-2">
                  <Input
                    value={usernameInput}
                    placeholder="e.g. @chronogram, then click 'Add'"
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
              <div className="small-regular">
                Currently shared with: {users.length - 1} other user{users.length === 2 ? "" : "s"}.
              </div>
              <ul
                id="sharedWithList"
                className="w-full max-w-5xl"
                style={{
                  maxHeight: '200px',
                  overflowY: 'auto',
                }}>
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

        <FormField
          control={form.control}
          name="locked"
          render={({ field }) => (
            <FormItem className="bg-light-3 flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="body-bold">
                  Lock Capsule
                </FormLabel>
                <p className="small-regular">You will no longer be able to edit capsule content after locking.</p>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex gap-4 items-center justify-start">

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
                <AlertDialogTitle>Discard changes?</AlertDialogTitle>
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

export default CreateCapsuleForm;