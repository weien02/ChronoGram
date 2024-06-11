import LockedCapsuleCarousel from "@/components/capsules/LockedCapsuleCarousel";
import { Card, CardHeader, CardContent} from '@/components/ui/card';

function MyCapsules() {
    return (
      <div className="flex flex-1">
        <div className="common-container">
          <div className="flex-start gap-3 justify-start w-full max-w-5xl">
            <h2 className="h3-bold md:h2-bold text-left">My Capsules</h2>
          </div>
          <div>
            <Card className="mt-8 bg-light-3">
              <CardHeader>
                <h2 className="text-xl font-semibold">My Locked Capsules</h2>
              </CardHeader>
              <CardContent className='flex justify-center'>
                <LockedCapsuleCarousel />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>    
    );
}
  

export default MyCapsules;