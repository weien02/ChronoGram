import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel";
import LockedCapsuleCard from "./LockedCapsuleCard";

function LockedCapsuleCarousel() {
  return (
    <Carousel className="w-full max-w-xs sm:max-w-lg xl:max-w-xl">
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index} className="sm:basis-1/2">
            <div className="p-1">
              <LockedCapsuleCard />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}

export default LockedCapsuleCarousel;