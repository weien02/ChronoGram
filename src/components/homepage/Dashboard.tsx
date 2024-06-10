import { Card, CardHeader, CardContent} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CapsuleCarousel from '../capsules/CapsuleCarousel';
import { getFirstname } from '@/_authentication/authFunctions';

function Dashboard() {
  return (
    <div className="p-6">
        
        <h1 className="mb-8 h3-bold md:h2-bold">{getFirstname()}'s Dashboard *Placeholder*</h1>

      <div className="gap-6">
        <Card className="bg-light-3">
          <CardHeader>
            <h2 className="text-xl font-semibold">Recent Activity</h2>
          </CardHeader>
          <CardContent className='flex justify-center'>
            <CapsuleCarousel />
          </CardContent>
        </Card>

        <Card className="mt-8 bg-light-3">
          <CardHeader>
            <h2 className="text-xl font-semibold">Upcoming Unlocks</h2>
          </CardHeader>
          <CardContent className='flex justify-center'>
            <CapsuleCarousel />
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-light-3">
          <CardHeader>
            <h2 className="font-semibold">Capsules Created</h2>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">0</p>
            <p className='mt-2'>Time capsules you've created</p>
          </CardContent>
        </Card>

        <Card className="bg-light-3">
          <CardHeader>
            <h2 className="font-semibold">Capsules Unlocked</h2>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">0</p>
            <p className='mt-2'>Time capsules you've unlocked</p>
          </CardContent>
        </Card>

        <Card className="bg-light-3">
          <CardHeader>
            <h2 className="font-semibold">Shared With You</h2>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">0</p>
            <p className='mt-2'>Time capsules shared with you</p>
          </CardContent>
        </Card>
      </div>
      
        <div className="mt-12 flex justify-between items-center">
            <p>&copy; 2024 ChronoGram for Orbital - NUS School of Computing</p>
            <Button className="shad-button_primary" onClick={() => alert('You may contact us at chronogramorbital@gmail.com')}>
              Contact Admin
            </Button>
        </div>

    </div>
  );

};

export default Dashboard;