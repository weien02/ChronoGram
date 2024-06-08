import { Link, NavLink, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import useSignOut from "@/_authentication/hooks/useSignOut";
import { getFirstname, getUsername } from "@/_authentication/authFunctions";
import { sidebarLinks } from "@/constants";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"


function Sidebar(){

  const { pathname } = useLocation();
  const { toast } = useToast();
  const { signout } = useSignOut();
  
  return (
    <nav className="sidebar">
      <div className="flex flex-col gap-11">
        <Link to="/" className="flex gap-3 items-center">
           <img
              src="assets/icon/Icon-60@2x.png"
              alt="logo"
              width={40}
              height={40}
          />
          <h1 className="h3-bold">ChronoGram</h1>
        </Link>

        <Sheet>
          <SheetTrigger asChild>
            <div className="flex items-center gap-3 sidebar-link">
              <img
                src={"/assets/glyphs/user.png"}
                alt="profile"
                className={'h-14 w-14 rounded-full'}
              />
              <div className="flex flex-col">
                <p className="base-semibold">{getFirstname()}</p>
                <p className="small-regular text-primary-600">@{getUsername()}</p>
              </div>
            </div>
          </SheetTrigger>
          <SheetContent side="left" className="bg-light-3 w-[500px]">
            <SheetHeader>
              <SheetTitle>Edit profile *Not working!*</SheetTitle>
              <SheetDescription>
                Update your profile details.
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="firstName" className="text-left">
                  First Name
                </Label>
                <Input id="name" defaultValue={getFirstname()} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-left">
                  Username
                </Label>
                <Input id="username" defaultValue={getUsername()} className="col-span-3" />
              </div>
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button type="submit" className="shad-button_primary">Save changes *Does nothing*</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>

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