import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
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
import useCreateCapsule from "./hooks/useCreateCapsule";
import { Textarea } from "../ui/textarea";
import { useNavigate } from "react-router-dom";

function CreateCapsuleForm() {

    const [textValue, setTextValue] = useState('');
    const [textNotes, setTextNotes] = useState([]);
    const [usernameInput, setUsernameInput] = useState("");
    const [users, setUsers] = useState<string[]>([getUid()]);
    const [images, setImages] = useState<string[]>([]);
    const [audios, setAudios] = useState<string[]>([]);
    const { toast } = useToast();
    const nextButtonRef = useRef<HTMLButtonElement>(null);
    const nextAudioButtonRef = useRef<HTMLButtonElement>(null);
    const nextTextButtonRef = useRef<HTMLButtonElement>(null);
    const { createCapsule } = useCreateCapsule();
    const navigate = useNavigate();

    const handleTextChange = (e) => {
      setTextValue(e.target.value);
    };

    const handleAddText = () => {
      if (textValue.trim() !== '') {
        setTextNotes([...textNotes, textValue]);
        setTextValue('');
      }
      setTimeout(() => {
        // To scroll to the end of carousel
        for (let i = 0; i < textNotes.length; i++) {
          nextTextButtonRef.current.click();
        }
      }, 500);
      
    };

    const handleDeleteText = (indexToDelete: number) => {
      setTextNotes((prevNotes) => {
        const updatedNotes = [...prevNotes];
        updatedNotes.splice(indexToDelete, 1);
        return updatedNotes;
      });
    };

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

    const handleDeleteImage = (indexToDelete: number) => {
      setImages((prevImages) => {
        const updatedImages = [...prevImages];
        updatedImages.splice(indexToDelete, 1);
        return updatedImages;
      });
    };

    const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setAudios((prevAudios) => [...prevAudios, reader.result as string]);
      };
      if (file) reader.readAsDataURL(file);
  
      setTimeout(() => {
        for (let i = 0; i < audios.length; i++) {
          nextAudioButtonRef.current?.click();
        }
      }, 500);
    };

    const handleDeleteAudio = (indexToDelete: number) => {
      setAudios((prevAudios) => {
        const updatedAudios = [...prevAudios];
        updatedAudios.splice(indexToDelete, 1);
        return updatedAudios;
      });
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

    {/*Form Validation*/}
    const formSchema = z.object({
        title: z.string().min(1, "Your capsule must have a title!"),
        unlockDate: z.date({required_error: "Your capsule must have an unlocking date!"}),
        notes: z.array(z.string()),
        images: z.array(z.string()),
        audios: z.array(z.string()),
        sharedWith: z.array(z.string()),
        locked: z.boolean()
    });
      
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          title: "",
          notes: [],
          images: [],
          audios: [],
          sharedWith: [getUid()],
          locked: false,
        },
    });
    
    function onSubmit(values: z.infer<typeof formSchema>) {
      toast({
        title: "Creating capsule...",
        description: "Please wait...",
      });
      createCapsule(values);
    }

    {/* Start of form */}
    return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-9 w-full max-w-5xl">

        {/*Title*/}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="body-bold">Title</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Type your title here." className="shad-input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/*Unlock Date*/}
        <FormField
          control={form.control}
          name="unlockDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="body-bold">Unlocking Date</FormLabel>
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

        {/*Notes*/}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="body-bold">Add Notes</FormLabel>
                <div className="small-regular">(Notes will be hidden when time capsule is locked.)</div>
                <FormControl>
                  <div>
                    <Textarea 
                      onChange={handleTextChange}
                      value={textValue}
                      className="shad-textarea"
                      placeholder="Type your note here."
                    />
                    <Button 
                      type="button" 
                      className="shad-button_primary mt-2" 
                      onClick={handleAddText}
                    >
                      Add Note
                    </Button>
                  </div>
                </FormControl>
                <div className="flex justify-center mt-4">
                  <Carousel className="w-full max-w-xs">
                    <CarouselContent>
                      {textNotes.length === 0 ? (
                        <CarouselItem className="rounded-lg">
                          <div className="p-1 flex justify-center items-center h-40">
                            <p>No notes added</p>
                          </div>
                        </CarouselItem>
                      ) : (
                        textNotes.map((note, index) => (
                          <CarouselItem key={index}>
                            <div className="p-1">
                              <Card className="bg-light-1 p-4">
                                <CardContent className="p-1 flex justify-center items-center">
                                  <p>{note}</p>
                                </CardContent>
                              </Card>
                            </div>
                            <div className="py-2 text-center small-regular">
                              Note {index + 1} of {textNotes.length}
                            </div>
                            <Button onClick={() => handleDeleteText(index)} type="button" className="mx-auto justify-center shad-button_destructive">
                              Remove
                            </Button>
                          </CarouselItem>
                        ))
                      )}
                    </CarouselContent>
                    <CarouselPrevious type="button" />
                    <CarouselNext ref={nextTextButtonRef} type="button" />
                  </Carousel>
                </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/*Photos*/}
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="body-bold">Upload Photos</FormLabel>
              <div className="small-regular">(Photos will be hidden when time capsule is locked.)</div>
              <FormControl>
                <div>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange} 
                    id="photoInput"
                    style={{ display: 'none' }}
                  />
                  <Button 
                    type="button" 
                    className="shad-button_primary" 
                    onClick={() => document.getElementById('photoInput').click()}
                  >
                    Add Files
                  </Button>
                </div>
              </FormControl>
              <div className="flex justify-center mt-4">
                <Carousel className="w-full max-w-xs">
                  <CarouselContent>
                    {images.length === 0 ? (
                      <CarouselItem className="rounded-lg">
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
                          <div className="py-2 text-center small-regular">
                            Photo {index + 1} of {images.length}
                          </div>
                          <Button onClick={() => handleDeleteImage(index)} type="button" className="mx-auto justify-center shad-button_destructive">
                            Remove
                          </Button>
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

        {/*Audio*/}
        <FormField
          control={form.control}
          name="audios"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="body-bold">Upload Audio Files</FormLabel>
              <div className="small-regular">(Audio files will be hidden when time capsule is locked.)</div>
              <FormControl>
                <div>
                  <input 
                    type="file" 
                    accept=".mp3,.wav,.ogg,.flac,.aac,.m4a" 
                    onChange={handleAudioChange} 
                    id="audioInput"
                    style={{ display: 'none' }}
                  />
                    <Button 
                      type="button" 
                      className="shad-button_primary" 
                      onClick={() => document.getElementById('audioInput').click()}
                    >
                      Add Files
                    </Button>
                  </div>
              </FormControl>
              <div className="flex justify-center mt-4">
                <Carousel className="w-full max-w-xs">
                  <CarouselContent>
                    {audios.length === 0 ? (
                      <CarouselItem className="rounded-lg">
                        <div className="p-1 flex justify-center items-center h-40">
                          <p>No audio files uploaded</p>
                        </div>
                      </CarouselItem>
                    ) : (
                      audios.map((src, index) => (
                        <CarouselItem key={index}>
                          <div className="p-1">
                            <Card>
                              <CardContent className="p-1 flex justify-center items-center">
                                <audio controls>
                                  <source src={src} />
                                  Your browser does not support the audio element.
                                </audio>
                              </CardContent>
                            </Card>
                          </div>
                          <div className="py-2 text-center small-regular">
                            Audio {index + 1} of {audios.length}
                          </div>
                          <Button onClick={() => handleDeleteAudio(index)} type="button" className="mx-auto justify-center shad-button_destructive">
                            Remove
                          </Button>
                        </CarouselItem>
                      ))
                    )}
                  </CarouselContent>
                  <CarouselPrevious type="button" />
                  <CarouselNext ref={nextAudioButtonRef} type="button" />
                </Carousel>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/*Share*/}
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
                    placeholder="e.g. @chronogram"
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
                    Add User
                  </Button>
                </div>
              </FormControl>
              <div className="small-regular">
                Shared with: {users.length - 1} other user{users.length === 2 ? "" : "s"}.
              </div>
              <ul
                id="sharedWithList"
                className="w-full max-w-5xl"
                style={{
                  maxHeight: '200px',
                  overflowY: 'auto',
                }}>
                {users.map((uid, index) => (
                  <li key={uid} className="mt-4 flex items-center justify-between">
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

        {/*Lock*/}
        <FormField
          control={form.control}
          name="locked"
          render={({ field }) => (
            <FormItem className="bg-light-3 flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="body-bold">
                  Lock Capsule
                </FormLabel>
                <p className="small-regular">You will no longer be able to edit time capsule contents after locking.</p>
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
                <AlertDialogAction onClick={() => navigate(-1)}>Confirm Discard</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button
            type="submit"
            className="shad-button_primary"
            onClick={() => {
              form.setValue("notes", textNotes);
              form.setValue("sharedWith", users);
              form.setValue("images", images);
              form.setValue("audios", audios);
            }}>
            Create
          </Button>

        </div>
      </form>
    </Form>
  );
};

export default CreateCapsuleForm;