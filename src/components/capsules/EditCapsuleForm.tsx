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
import { useEffect, useRef, useState } from "react";
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
//import useCreateCapsule from "./hooks/useCreateCapsule";
import { Textarea } from "../ui/textarea";
import { storage } from "@/lib/firebase/config";
import { getDownloadURL, ref } from "firebase/storage";
import { Checkbox } from "../ui/checkbox";

function EditCapsuleForm({ capsule }) {

    function isDataURL(str) {
        const regex = /^\s*data:([a-zA-Z]+\/[a-zA-Z0-9\-\+\.]+)?(;base64)?,[a-zA-Z0-9!$&',()*+;=\-._~:@\/?%\s]*\s*$/;
        return regex.test(str);
    }

    const capsuleId = capsule.capsuleId;
    const capsuleTitle = capsule.title;
    const unlockingTime = capsule.unlockDate;
    const [textNotes, setTextNotes] = useState(capsule.notes);
    const [images, setImages] = useState<string[]>(capsule.images);
    const [audios, setAudios] = useState<string[]>(capsule.audios);
    const [users, setUsers] = useState<string[]>(capsule.sharedWith);
    const isLocked = capsule.locked;
    const createdBy = capsule.createdBy;
    const [fetchedImages, setFetchedImages] = useState([]);
    const [fetchedAudios, setFetchedAudios] = useState([]);
    const [deletedImages, setDeletedImages] = useState([]);
    const [deletedAudios, setDeletedAudios] = useState([]);
    const [forceUnlocked, setForceUnlocked] = useState(false);

    const handleCheckboxChange = (e) => {
        setForceUnlocked(!forceUnlocked);
    };

    useEffect(() => {
        // Function to fetch images from Firebase Storage
        const fetchImageFromStorage = async (src) => {
          try {
            const imageUrl = await getDownloadURL(ref(storage, `capsules/${capsuleId}/images/${src}`));
            return imageUrl;
          } catch (error) {
            console.error('Error fetching image:', error);
            return null;
          }
        };
    
        // Fetch images from Firebase Storage for non-data URLs
        const fetchImages = async () => {
          const fetchedImages = await Promise.all(
            images.map(async (src) => {
              if (!isDataURL(src)) {
                return fetchImageFromStorage(src);
              } else {
                return src; // If src is already a data URL, no need to fetch
              }
            })
          );
          setFetchedImages(fetchedImages);
        };
    
        fetchImages();
      }, [images]);

      useEffect(() => {
        // Function to fetch audio files from Firebase Storage
        const fetchAudioFromStorage = async (src) => {
          try {
            const audioUrl = await getDownloadURL(ref(storage, `capsules/${capsuleId}/audios/${src}`));
            return audioUrl;
          } catch (error) {
            console.error('Error fetching audio:', error);
            return null;
          }
        };
    
        // Fetch audio files from Firebase Storage for non-data URLs
        const fetchAudios = async () => {
          const fetchedAudios = await Promise.all(
            audios.map(async (src) => {
              if (!isDataURL(src)) {
                return fetchAudioFromStorage(src);
              } else {
                return src; // If src is already a data URL, no need to fetch
              }
            })
          );
          setFetchedAudios(fetchedAudios);
        };
    
        fetchAudios();
      }, [audios]);

    

    const [textValue, setTextValue] = useState('');
    const [usernameInput, setUsernameInput] = useState("");
    const { toast } = useToast();
    const nextButtonRef = useRef<HTMLButtonElement>(null);
    const nextAudioButtonRef = useRef<HTMLButtonElement>(null);
    const nextTextButtonRef = useRef<HTMLButtonElement>(null);
    //const { createCapsule } = useCreateCapsule();

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
      setDeletedImages([...deletedImages, images[indexToDelete]]);
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
      reader.readAsDataURL(file);
  
      setTimeout(() => {
        for (let i = 0; i < audios.length; i++) {
          nextAudioButtonRef.current?.click();
        }
      }, 500);
    };

    const handleDeleteAudio = (indexToDelete: number) => {
        setDeletedAudios([...deletedAudios, audios[indexToDelete]]);
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
        locked: z.boolean(),
        deletedImages: z.array(z.string()),
        deletedAudios: z.array(z.string()),
    });
      
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: capsuleTitle,
            unlockDate: new Date(unlockingTime),
            notes: textNotes,
            images: images,
            audios: audios,
            sharedWith: users,
            locked: isLocked,
          },
    });
    
    function onSubmit(values: z.infer<typeof formSchema>) {
      //createCapsule(values);
      console.log(forceUnlocked);
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
                    {(isLocked || createdBy !== getUid()) ? (
                        <p>{capsuleTitle}</p>
                    ) : (
                        <FormControl>
                        <Input type="text" placeholder={capsuleTitle} value={capsuleTitle} className="shad-input" {...field} />
                        </FormControl>
                    )}
                    <FormMessage />
                    </FormItem>
                )}
            />

            {/*Unlock Date*/}
            <FormField
                control={form.control}
                name="unlockDate"
                defaultValue={new Date(unlockingTime)}
                render={({ field }) => (
                    <FormItem className="flex flex-col">
                    <FormLabel className="body-bold">Unlocking Date</FormLabel>
                    {(isLocked || createdBy !== getUid()) ? (
                        <p>{format(new Date(unlockingTime), 'do MMMM yyyy')}</p>
                    ) : (
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
                    )}
                    <FormMessage />
                    </FormItem>
                )}
            />

            {!isLocked && (
                <>
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
                                fetchedImages.map((src, index) => (
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
                                fetchedAudios.map((src, index) => (
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
                  </>
            )}

            {/*Share*/}
            <FormField
            control={form.control}
            name="sharedWith"
            render={({ field }) => (
                <FormItem>
                <FormLabel className="body-bold">
                    Share
                </FormLabel>
                {createdBy === getUid() && (
                    <FormControl>
                        <div className="flex gap-2">
                        <Input
                            value={usernameInput}
                            placeholder="e.g. @chronogram"
                            onChange={(e) => setUsernameInput(e.target.value)}
                            className="shad-input"
                        />
                        <Button
                            type="button"
                            onClick={() => {
                            if (usernameInput.length >= 2 && usernameInput.charAt(0) === "@") {
                                handleAddUsername(usernameInput.substring(1));
                            } else {
                                handleAddUsername(usernameInput);
                            }
                            }}
                            className="shad-button_primary"
                        >
                            Add User
                        </Button>
                        </div>
                    </FormControl>
                )}
                <div className="small-regular">
                    Currently shared with: {users.length - 1} other user{users.length === 2 ? "" : "s"}.
                </div>
                <ul
                    id="sharedWithList"
                    className="w-full max-w-5xl"
                    style={{
                    maxHeight: '200px',
                    overflowY: 'auto',
                    }}
                >
                {users.map((uid, index) => (
                    <li key={index} className="mt-4 flex items-center justify-between">
                        <UserBadge uid={uid} index={index} />
                        {index > 0 && createdBy === getUid() ? (
                        <div className="flex items-center justify-end">
                            <Button
                            type="button"
                            onClick={() => handleDeleteUser(index)}
                            className="shad-button_destructive"
                            >
                            Remove
                            </Button>
                        </div>
                        ) : createdBy !== getUid() && uid === getUid() ? (
                        <div className="flex items-center justify-end">
                            <Button
                            type="button"
                            onClick={() => handleDeleteUser(index)}
                            className="shad-button_destructive"
                            >
                            Decline Share
                            </Button>
                        </div>
                        ) : null}
                    </li>
                    ))}
                </ul>
                <FormMessage className="shad-form_message" />
                </FormItem>
            )}
            />

            {/*Lock*/}
            {!isLocked && createdBy === getUid() && (
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
            )}

            {!isLocked && createdBy === getUid() && (
                <div className="bg-light-3 flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                        <p className="body-bold">
                            Force Unlock Capsule
                        </p>
                        <p className="small-regular">Unlocking date will be forcibly reassigned to today.</p>
                    </div>
                    <Checkbox
                        checked={forceUnlocked}
                        onCheckedChange={handleCheckboxChange}
                    />
                </div>
            )}

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

            {createdBy === getUid() && (
                <AlertDialog>
                    <AlertDialogTrigger>
                    <Button
                        type="button"
                        className="shad-button_destructive">
                        Delete Capsule
                    </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-light-4">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete capsule?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action is irreversible!
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction>Confirm Delete</AlertDialogAction>
                    </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}

            <Button
                type="submit"
                className="shad-button_primary"
                onClick={() => {
                    form.setValue("notes", textNotes);
                    form.setValue("sharedWith", users);
                    form.setValue("images", images);
                    form.setValue("audios", audios);
                    form.setValue("deletedImages", deletedImages);
                    form.setValue("deletedAudios", deletedAudios);
                }}>
                Save Changes
            </Button>

            </div>
        </form>
        </Form>
    );
};

export default EditCapsuleForm;