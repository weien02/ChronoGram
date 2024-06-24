import { Card, CardHeader, CardContent} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getFirstname, getUid } from '@/_authentication/authFunctions';
import LockedCapsuleCarousel from '../capsules/LockedCapsuleCarousel';
import useCapsuleState from '@/states/capsuleState';
import UnlockedCapsuleCarousel from '../capsules/UnlockedCapsuleCarousel';
import { useNavigate } from 'react-router-dom';

function Dashboard() {

  const navigate = useNavigate();
  const permittedCapsules = useCapsuleState((state) => state.permittedCapsules);
  const fetchCapsules = useCapsuleState((state) => state.fetchCapsules);
  const myCapsules = permittedCapsules === null ? [] : permittedCapsules.filter(x => x.createdBy === getUid());
  const sharedWithMe = permittedCapsules === null ? [] : permittedCapsules.filter(x => x.createdBy !== getUid());

  return (
    <div className="p-6">
      <div className='mb-8 flex items-center justify-between'>
        <h1 className="h3-bold md:h2-bold">{getFirstname()}'s Dashboard</h1>
        <Button className='shad-button_primary' onClick={() => fetchCapsules()}>Fetch</Button>
      </div>
      
      <div className="gap-6">
        {/* Don't remove the surrounding div, can be used to add more cards*/ }
        
        <Card className="mt-8 bg-light-3">
          <CardHeader>
            <h2 className="text-xl font-semibold">Recent Unlocks</h2>
          </CardHeader>
          <CardContent className='flex justify-center'>
            <UnlockedCapsuleCarousel pers={2}/>
          </CardContent>
        </Card>
        
        <Card className="mt-8 bg-light-3">
          <CardHeader>
            <h2 className="text-xl font-semibold">Upcoming Unlocks</h2>
          </CardHeader>
          <CardContent className='flex justify-center'>
            <LockedCapsuleCarousel pers={2}/>
          </CardContent>
        </Card>

      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-light-3 sidebar-link"
          onClick={() => {
            fetchCapsules();
            navigate("/my-capsules");
          }}
        >
          <CardHeader>
            <h2 className="font-semibold">Capsules Created</h2>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{myCapsules.length}</p>
            <p className='mt-2'>Time capsules you've created</p>
          </CardContent>
        </Card>

        <Card className="bg-light-3 sidebar-link"
          onClick={() => {
            fetchCapsules();
            navigate("/my-capsules");
          }}
        >
          <CardHeader>
            <h2 className="font-semibold">Shared With You</h2>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{sharedWithMe.length}</p>
            <p className='mt-2'>Time capsules shared with you</p>
          </CardContent>
        </Card>

        <Card className="bg-light-3">
          <CardHeader>
            <h2 className="font-semibold">Achievements</h2>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">0</p>
            <p className='mt-2'>Achievements you have completed</p>
          </CardContent>
        </Card>
      </div>

      
      
        <div className="mt-12 flex justify-between items-center">
            <p>&copy; 2024 ChronoGram for Orbital - NUS School of Computing</p>
            <Button className='shad-button_primary'> 
              <a href="mailto:chronogramorbital@gmail.com">Email Us!</a>
            </Button>
        </div>

    </div>
  );

};

export default Dashboard;