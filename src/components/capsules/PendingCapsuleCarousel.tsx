import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel";
import useCapsuleState from "@/states/capsuleState";
import { getUid } from "@/_authentication/authFunctions";
import PendingCapsuleCard from "./PendingCapsuleCard";

function PendingCapsuleCarousel({pers}) {

  const permittedCapsules = useCapsuleState(state => state.permittedCapsules);
  const unlockedCapsules = permittedCapsules === null ? [] : permittedCapsules.filter(x => !x.locked);
  const capsulesToDisplay = pers === 0
  ? unlockedCapsules.filter(x => x.createdBy === getUid())
  : pers === 1
  ? unlockedCapsules.filter(x => x.createdBy !== getUid())
  : pers === 2
  ? unlockedCapsules
  : [];

  capsulesToDisplay.sort((x, y) => y.createdAt - x.createdAt);
  
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
              <PendingCapsuleCard capsule={capsule}/>
            </div>
          </CarouselItem>
        )))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}

export default PendingCapsuleCarousel;