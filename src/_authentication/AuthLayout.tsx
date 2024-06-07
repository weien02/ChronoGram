import useAuthState from '@/states/authState';
import {Outlet, Navigate} from 'react-router-dom';

function AuthLayout() {
  const authUser = useAuthState(state => state.user);
  return (
      <>
       {authUser 
       ? (<Navigate to="/" />)
       : (
          <>
            <img
              src="/assets/background/background_crop.jpg"
              alt="bg"
              className="hidden xl:block h-screen w-1/2 object-cover bg-no-repeat"
            />
            <section className="flex flex-1 items-center flex-col py-10 max-h-screen overflow-y-auto justify-start md:justify-center">
              <Outlet />
            </section>
          </>
       )
      }
      </>
  );
}

export default AuthLayout;