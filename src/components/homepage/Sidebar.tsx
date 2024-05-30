import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import useSignOut from "@/_authentication/hooks/useSignOut";

function Sidebar(){

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

        <Button className="shad-button_primary">
          Time Tunnel *Not working*
        </Button>

        <Button className="shad-button_primary">
          My Capsules
        </Button>

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