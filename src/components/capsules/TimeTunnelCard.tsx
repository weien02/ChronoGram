import { useEffect, useState } from "react";
import UserBadge from "./UserBadge";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "@/lib/firebase/config";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { getUid } from "@/_authentication/authFunctions";
import useDeclineShare from "./hooks/useDeclineShare";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog";
import Comment from "./Comment";
import { Textarea } from "../ui/textarea";
import useAddComment from "./hooks/useAddComment";
import useCapsuleState from "@/states/capsuleState";

const TimeTunnelCard = ({ capsule }) => {

    const images = capsule.images;
    const audios = capsule.audios;
    const [fetchedAudios, setFetchedAudios] = useState([]);
    const [fetchedImages, setFetchedImages] = useState([]);
    const sharedWith = capsule.sharedWith.slice(1);
    const navigate = useNavigate();
    const { declineShare } = useDeclineShare();
    const [commentText, setCommentText] = useState('');
    const { addComment }  = useAddComment();
    const fetchCapsules = useCapsuleState(state => state.fetchCapsules);

    function howManyDaysAgo() {
        const timing = Math.abs(capsule.unlockDate - Date.now()) / (1000 * 60 * 60 * 24);
        
        if (timing < 1) {
            return "Today"
        }
        const days = Math.floor(timing);
        if (days === 1) {
            return "1 day ago"
        } else {
            return days + " days ago"
        }
      }
  
    useEffect(() => {
        if (!capsule.locked || capsule.unlockDate <= Date.now()) {
            const fetchImageFromStorage = async (src) => {
            try {
                const imageUrl = await getDownloadURL(ref(storage, `capsules/${capsule.capsuleId}/images/${src}`));
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
                    return fetchImageFromStorage(src);
                })
            );
            setFetchedImages(fetchedImages);
            }; 
        fetchImages();
        } else {
            console.log("Locked capsule.");
        }
      }, [images]);

      useEffect(() => {
        if (!capsule.locked || capsule.unlockDate <= Date.now()) {
            const fetchAudioFromStorage = async (src) => {
            try {
                const audioURL = await getDownloadURL(ref(storage, `capsules/${capsule.capsuleId}/audios/${src}`));
                return audioURL;
            } catch (error) {
                console.error('Error fetching audio:', error);
                return null;
            }
            };
        
            // Fetch audio from Firebase Storage for non-data URLs
            const fetchAudios = async () => {
            const fetchedAudios = await Promise.all(
                audios.map(async (src) => {
                    return fetchAudioFromStorage(src);
                })
            );
            setFetchedAudios(fetchedAudios);
            };
        
            fetchAudios();
        } else {
            console.log("Locked capsule.");
        }
      }, [audios]);
  
      return capsule.locked && capsule.unlockDate > Date.now()
      ? (
        <Card className="p-8 text-center bg-light-3">
            <CardHeader className="flex flex-col items-center">
                <img src="/assets/glyphs/lock.png" alt="Lock Icon" width={40} height={40} className="mb-4" />
                <CardTitle className="text-2xl font-bold">Time Capsule Locked</CardTitle>
            </CardHeader>
            <CardContent>
                <CardDescription>
                Time capsule contents are unable to be viewed or edited.
                </CardDescription>
            </CardContent>
        </Card>
      )
      : (
        <Card className="p-8 mb-6 bg-light-1">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <UserBadge uid={capsule.createdBy} index={1}></UserBadge>
                    {capsule.sharedWith.length > 1 && (
                        <Popover>
                            <PopoverTrigger asChild>
                                <button>
                                    <p className="ml-4 small-regular sharedWith-link">
                                        +{capsule.sharedWith.length - 1} other{capsule.sharedWith.length > 2 ? "s" : ""}
                                    </p>
                                </button>
                            </PopoverTrigger>
                            <PopoverContent className="bg-light-3">
                                <p className="base-regular">Shared with:</p>
                                {sharedWith.map((id) => (
                                    <div className="p-2">
                                        <UserBadge index={1} uid={id}/>
                                    </div>
                                    
                                ))}
                            </PopoverContent>
                        </Popover>
                    )}
                </div>

                <Popover>
                    <PopoverTrigger>
                        <img src="/assets/glyphs/menu.png" className="h-5 w-5"/>
                    </PopoverTrigger>
                    <PopoverContent className="bg-light-3 w-full">
                        { capsule.createdBy === getUid()
                        
                        ? (<Button className="shad-button_primary" onClick={() => navigate(`/edit-capsule/${capsule.capsuleId}`)}>Edit Capsule</Button>)
                        
                        : (<AlertDialog>
                            <AlertDialogTrigger>
                                <Button
                                    type="button"
                                    className="shad-button_destructive"
                                >
                                    Decline Share
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-light-4">
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Decline Share?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        You will no longer be able to view this time capsule.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => declineShare(capsule.capsuleId, capsule.sharedWith, 1)}>Confirm</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>)
                        }
                        
                    </PopoverContent>
                </Popover>
            </div>
    
            <div className="small-medium lg:base-medium py-5 justify-between">
                <p className="h3-bold mb-2">{capsule.title}</p>
                {capsule.locked && (<div className="flex items-center mb-4">
                    <img src="/assets/glyphs/unlock.png" className="w-6 h-6 mr-2" />
                    <p className="small-regular">{howManyDaysAgo()}</p>
                </div>
                )}

                {capsule.notes.length > 0 && (
                    <div>
                        {capsule.notes.map((note, index) => (
                            <p className="mb-4" key={index}>{note}</p>
                        ))}
                    </div>
                )}

                {/*Image Carousel*/}
                {images.length > 0 && (
                    <Carousel className="w-full max-w-xs mx-auto">
                        <CarouselContent>
                            {fetchedImages.map((src, index) => (
                                <CarouselItem key={index}>
                                    <div className="p-1">
                                        <Card>
                                            <CardContent className="carousel-image-wrapper">
                                                <img src={src} alt={`Image ${index + 1}`} className="carousel-image rounded-lg" />
                                            </CardContent>
                                        </Card>
                                    </div>
                                    <div className="py-2 text-center small-regular">
                                        Photo {index + 1} of {fetchedImages.length}
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious type="button" />
                        <CarouselNext type="button" />
                    </Carousel>
                )}

                {/*Audio Carousel*/}
                {audios.length > 0 && (
                    <Carousel className="w-full max-w-xs mx-auto">
                        <CarouselContent>
                            {fetchedAudios.map((src, index) => (
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
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious type="button" />
                        <CarouselNext type="button" />
                    </Carousel>
                )}

                
                {capsule.locked && (<div className="flex justify-end mt-4">
                    <Dialog>
                        <DialogTrigger asChild>
                            <button className="flex items-center" onClick={() => fetchCapsules()}>
                                <img src="/assets/glyphs/comments.png" alt="Comments" className="w-6 h-6 mr-2" />
                                <p className="small-regular">{capsule.comments.length} reflection{capsule.comments.length === 1 ? "" : "s"}</p>
                            </button>
                        </DialogTrigger>
                        <DialogContent className="bg-light-4">
                            <DialogTitle>Reflections</DialogTitle>
                            {capsule.comments.length === 0 && (<p className="small-regular">Be the first to post a reflection!</p>)}
                            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                {capsule.comments.map((comment) => (
                                <div key={comment.commentId}>
                                    <Comment comment={comment} capsuleId={capsule.capsuleId} otherComments={capsule.comments}/>
                                </div>
                                ))}
                            </div>
                            <div className="flex gap-2 items-center">
                                <Textarea
                                    className="shad-input"
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    placeholder="Type your reflection here!"
                                />
                                <Button
                                    className="shad-button_primary"
                                    onClick={() => {
                                        if (commentText !== "") {
                                            addComment(capsule.capsuleId, commentText, capsule.createdBy === getUid());
                                            setCommentText("");
                                        }
                                    }}
                                >
                                    Post
                                </Button>
                            </div>

                        </DialogContent>
                    </Dialog>
                </div>)}
                    
                
            </div>
        </Card>
    );
  };
  
  export default TimeTunnelCard;