import Topbar from "@/components/homepage/Topbar";
import Sidebar from "@/components/homepage/Sidebar";
import Bottombar from "@/components/homepage/Bottombar";
import { Navigate, Outlet } from "react-router-dom";
import useAuthState from "@/states/authState";

function RootLayout() {
    const authUser = useAuthState(state => state.user);
    if (authUser) {
        return (
            <div className='w-full md:flex'>
                <Topbar />
                <Sidebar />
                    <section className="flex flex-1 h-full overflow-auto">
                        <Outlet />
                    </section>
                <Bottombar />
            </div>
        );
    } else {
        return (<Navigate to="/sign-in" />);
    } 
}

export default RootLayout;