import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import useSignOut from "@/_authentication/hooks/useSignOut";

function Topbar(){

  const { toast } = useToast();
  const { signout } = useSignOut();

  return (
    <section className="topbar">
      <div className="flex-between py-4 px-5">
        <Link to="/" className="flex gap-3 items-center">
          <img
            src="assets/icon/Icon-60@2x.png"
            alt="logo"
            width={40}
            height={40}
          />
          <h1 className="h3-bold">ChronoGram</h1>
        </Link>

        <div className="flex gap-4">
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
        </div>
      </div>
    </section>
  )
}

export default Topbar;