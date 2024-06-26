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
  import { Card, CardContent } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

const TimeTunnelCard = ({ capsule }) => {

    const images = capsule.images;
    const audios = capsule.audios;
    const [fetchedAudios, setFetchedAudios] = useState([]);
    const [fetchedImages, setFetchedImages] = useState([]);
    const sharedWith = capsule.sharedWith.slice(1);
    const navigate = useNavigate();

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
        // Function to fetch images from Firebase Storage
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
      }, [images]);

      useEffect(() => {
        // Function to fetch audio files from Firebase Storage
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
      }, [audios]);
  
      return (
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
                        <Button className="shad-button_primary" onClick={() => navigate(`/edit-capsule/${capsule.capsuleId}`)}>Edit Capsule</Button>
                    </PopoverContent>
                </Popover>
            </div>
    
            <div className="small-medium lg:base-medium py-5 justify-between">
                <p className="h3-bold mb-2">{capsule.title}</p>
                <div className="flex items-center mb-4">
                    <img src="/assets/glyphs/unlock.png" className="w-6 h-6 mr-2" />
                    <p className="small-regular">{howManyDaysAgo()}</p>
                </div>

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

                <div className="flex items-center mt-4 justify-end">
                    <img src="/assets/glyphs/comments.png" alt="Comments" className="w-6 h-6 mr-2" />
                    <p className="small-regular">{capsule.comments.length} comment{capsule.comments.length === 1 ? "" : "s"}</p>
                </div>
            </div>
        </Card>
    );
  };
  
  export default TimeTunnelCard;