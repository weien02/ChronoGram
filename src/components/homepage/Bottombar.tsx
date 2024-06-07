import { Link, useLocation } from "react-router-dom";
import { bottombarLinks } from "@/constants";

function Bottombar() {
  const { pathname } = useLocation();
  return (
    <section className="bottom-bar">
      {bottombarLinks.map((link) => {
        const isActive = pathname === link.route;
        return (
          <Link
            key={`bottombar-${link.label}`}
            to={link.route}
            className={`flex-center flex-col gap-1 p-2 transition
            ${isActive ? "rounded-[10px] bg-light-2 " : ""}`}>
            <img
              src={link.imgURL}
              alt={link.label}
              width={20}
              height={20}
            />
          </Link>
        );
      })}
      <Link to="/profile"
        className={`flex-center flex-col gap-1 p-2 transition rounded-full
        ${pathname === '/profile' ? "rounded-[10px] bg-light-2" : ""}`}>
        <img
          src={"/assets/glyphs/user.png"}
          width={20}
          height={20}
        />
      </Link>
    </section>
  );
}

export default Bottombar;