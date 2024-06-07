import {Routes, Route} from 'react-router-dom';
import './styles.css';
import AuthLayout from './_authentication/AuthLayout';
import SignInForm from './_authentication/forms/SignInForm';
import SignUpForm from './_authentication/forms/SignUpForm';
import RootLayout from './_root/RootLayout';
import { Home } from './_root/pages';
import { Toaster } from './components/ui/toaster';
import ResetPasswordForm from './_authentication/forms/ResetPasswordForm';
import TimeTunnel from './_root/pages/TimeTunnel';
import CreateCapsule from './_root/pages/CreateCapsule';
import MyCapsules from './_root/pages/MyCapsules';
import Profile from './_root/pages/Profile';

function App() {
  return (
    <>
    <main className="flex h-screen">
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/sign-in" element={<SignInForm />} />
          <Route path="/sign-up" element={<SignUpForm />} />
          <Route path="/reset-password" element={<ResetPasswordForm />} />
        </Route>

        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/time-tunnel" element={<TimeTunnel />} />
          <Route path="/my-capsules" element={<MyCapsules />} />
          <Route path="/create-capsule" element={<CreateCapsule />} />
        </Route>
      </Routes>
    </main>
    <Toaster />
    </>
  );
}

export default App;