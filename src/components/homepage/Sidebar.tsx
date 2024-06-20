import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import useSignOut from "@/_authentication/hooks/useSignOut";
import { getUid } from "@/_authentication/authFunctions";
import { sidebarLinks } from "@/constants";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import UserBadge from "../capsules/UserBadge";



function Sidebar(){

  const { pathname } = useLocation();
  const { toast } = useToast();
  const { signout } = useSignOut();
  const navigate = useNavigate();
  
  return (
    <nav className="sidebar">
      <div className="flex flex-col gap-11">
        <Link to="/" className="flex gap-3 items-center">
           <img
              src="/assets/icon/Icon-60@2x.png"
              alt="logo"
              width={40}
              height={40}
          />
          <h1 className="h3-bold">ChronoGram</h1>
        </Link>

        <Popover>
          <PopoverTrigger>
          <div className={`flex items-center sidebar-link ${pathname === "/edit-profile" ? "bg-light-2" : ""}`}>
            <UserBadge uid={getUid()} index={1} />
          </div>
          </PopoverTrigger>
          <PopoverContent side="right" className="w-30 flex justify-center bg-light-3">
            <Button className="shad-button_primary" onClick={() => navigate("/edit-profile")}>
              Edit Profile
            </Button>
          </PopoverContent>
        </Popover>


        <ul className="flex flex-col gap-6">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.route;
            return (
              <li
                key={link.label}
                className={`sidebar-link ${isActive ? "bg-light-2" : ""}`}>
                <NavLink
                  to={link.route}
                  className={`flex gap-4 items-center p-4 ${isActive ? "font-bold" : ""}`}>
                  <img
                    src={link.imgURL}
                    alt={link.label}
                    className="h-6 w-6"
                  />
                  {link.label}
                </NavLink>
              </li>
            );
          })}
        </ul>

      </div>
      
      <Button className="shad-button_primary"
          onClick={() => {
            try {
              signout();
            } catch(error) {
              toast({
                variant: "destructive",
                title: "Unexpected error.",
                description: error.message,
              })
            }}
          }>
        Sign Out
      </Button>

    </nav>
  );
}

export default Sidebar;