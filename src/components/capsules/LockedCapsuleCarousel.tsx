import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel";
import LockedCapsuleCard from "./LockedCapsuleCard";
import useCapsuleState from "@/states/capsuleState";
import { getUid } from "@/_authentication/authFunctions";

function LockedCapsuleCarousel({pers}) {

  const permittedCapsules = useCapsuleState(state => state.permittedCapsules);
  const lockedCapsules = permittedCapsules === null ? [] : permittedCapsules.filter(x => x.locked && (x.unlockDate > Date.now()));
  const capsulesToDisplay = pers === 0
  ? lockedCapsules.filter(x => x.createdBy === getUid())
  : pers === 1
  ? lockedCapsules.filter(x => x.createdBy !== getUid())
  : pers === 2
  ? lockedCapsules
  : [];

  capsulesToDisplay.sort((x, y) => x.unlockDate - y.unlockDate);
  
  return (
    <Carousel className="w-full max-w-xs sm:max-w-lg xl:max-w-xl">
      <CarouselContent>
        {capsulesToDisplay.length === 0
        ? (<CarouselItem className="rounded-lg">
          <div className="p-1 flex justify-center items-center h-20">
            <p>No capsules yet...</p>
          </div>
          </CarouselItem>)
        : (capsulesToDisplay.map((capsule, index) => (
          <CarouselItem key={index} className="sm:basis-1/2">
            <div className="p-1">
              <LockedCapsuleCard capsule={capsule}/>
            </div>
          </CarouselItem>
        )))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}

export default LockedCapsuleCarousel;