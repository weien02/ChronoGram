import {Routes, Route} from 'react-router-dom';
import './styles.css';
import AuthLayout from './_authentication/AuthLayout';
import SignInForm from './_authentication/forms/SignInForm';
import SignUpForm from './_authentication/forms/SignUpForm';
import RootLayout from './_root/RootLayout';
import { Home } from './_root/pages';
import { Toaster } from './components/ui/toaster';

function App() {
  return (
    <>
    <main className="flex h-screen">
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/sign-in" element={<SignInForm />} />
          <Route path="/sign-up" element={<SignUpForm />} />
        </Route>

        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
        </Route>
      </Routes>
    </main>
    <Toaster />
    </>
  );
}

export default App;