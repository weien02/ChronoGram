import LockedCapsuleCarousel from "@/components/capsules/LockedCapsuleCarousel";
import PendingCapsuleCarousel from "@/components/capsules/PendingCapsuleCarousel";
import UnlockedCapsuleCarousel from "@/components/capsules/UnlockedCapsuleCarousel";
import { Card, CardHeader, CardContent} from '@/components/ui/card';

function MyCapsules() {
    return (
      <div className="flex flex-1">
        <div className="common-container flex flex-col items-center w-full">
          <div className="flex-start gap-3 justify-start w-full max-w-5xl">
            <h2 className="h3-bold md:h2-bold text-left">My Capsules</h2>
          </div>
          <div className="w-full max-w-5xl">
            <Card className="mt-8 bg-light-3 w-full">
              <CardHeader>
                <h2 className="text-xl font-semibold">Pending Edits/Lock</h2>
              </CardHeader>
              <CardContent className='flex justify-center'>
                <PendingCapsuleCarousel pers={0} />
              </CardContent>
            </Card>
            <Card className="mt-8 bg-light-3 w-full">
              <CardHeader>
                <h2 className="text-xl font-semibold">Locked Capsules</h2>
              </CardHeader>
              <CardContent className='flex justify-center'>
                <LockedCapsuleCarousel pers={0} />
              </CardContent>
            </Card>
            <Card className="mt-8 bg-light-3 w-full">
              <CardHeader>
                <h2 className="text-xl font-semibold">Unlocked Capsules</h2>
              </CardHeader>
              <CardContent className='flex justify-center'>
                <UnlockedCapsuleCarousel pers={0} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>    
    );
}
  

export default MyCapsules;