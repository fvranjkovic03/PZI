import React, { useState, useEffect } from "react";
import { BiSolidSun, BiSolidMoon } from "react-icons/bi";
import { HiMenuAlt3, HiMenuAlt1 } from "react-icons/hi";
import ResponsiveMenu from "./ResponsiveMenu";
import { useNavigate } from "react-router-dom";

export const Navlinks = [
  {
    id: 1,
    name: "HOME",
    link: "/",
  },
{ id: 2, name: "API", link: "/api", auth: true },
  {
    id: 3,
    name: "ABOUT",
    link: "/about",
  },
];

const Navbar = ({ theme, setTheme }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getLoggedInUser = () => {
      const loggedInUser = localStorage.getItem("user");
      if (loggedInUser) {
        try {
          const parsedUser = JSON.parse(loggedInUser);
          setUser(parsedUser);
        } catch (error) {
          console.error("Error parsing user data:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    getLoggedInUser();
  }, []);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleSignOut = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  return (
    <div className="relative z-10 shadow-md w-full dark:bg-black dark:text-white duration-300">
      <div className="container py-2 md:py-0">
        <div className="flex justify-between items-center">
          <div>
            <span
              className="text-3xl font-bold font-serif cursor-pointer"
              onClick={() => navigate("/")}
            >
              Travel Planner
            </span>
          </div>
          <nav className="hidden md:block">
            <ul className="flex items-center gap-8">
              {Navlinks.map(({ id, name, link }) => (
                (name !== "API" || user) && (
                  <li key={id} className="py-4">
                    <a
                      href={link}
                      className="text-lg font-medium hover:text-primary py-2 hover:border-b-2 hover:border-primary transition-colors duration-500"
                    >
                      {name}
                    </a>
                  </li>
                )
              ))}
              {user ? (
                <>
                  <li className="py-4">
                    <a
                      href={user.isAdmin ? "/admin-panel" : "/dashboard"}
                      className="text-lg font-medium hover:text-primary py-2 hover:border-b-2 hover:border-primary transition-colors duration-500"
                    >
                      {user.isAdmin ? "ADMIN PANEL" : "DASHBOARD"}
                    </a>
                  </li>
                  <li className="py-4">
                    <button
                      onClick={handleSignOut}
                      className="text-lg font-medium hover:text-primary py-2 hover:border-b-2 hover:border-primary transition-colors duration-500"
                    >
                      SIGNOUT
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li className="py-4">
                    <a
                      href="/login"
                      className="text-lg font-medium hover:text-primary py-2 hover:border-b-2 hover:border-primary transition-colors duration-500"
                    >
                      LOGIN
                    </a>
                  </li>
                  <li className="py-4">
                    <a
                      href="/signup"
                      className="text-lg font-medium hover:text-primary py-2 hover:border-b-2 hover:border-primary transition-colors duration-500"
                    >
                      SIGNUP
                    </a>
                  </li>
                </>
              )}
              {theme === "dark" ? (
                <BiSolidSun onClick={() => setTheme("light")} className="text-2xl" />
              ) : (
                <BiSolidMoon onClick={() => setTheme("dark")} className="text-2xl" />
              )}
            </ul>
          </nav>
          <div className="flex items-center gap-4 md:hidden">
            {theme === "dark" ? (
              <BiSolidSun onClick={() => setTheme("light")} className="text-2xl" />
            ) : (
              <BiSolidMoon onClick={() => setTheme("dark")} className="text-2xl" />
            )}
            {showMenu ? (
              <HiMenuAlt1 onClick={toggleMenu} className="cursor-pointer transition-all" size={30} />
            ) : (
              <HiMenuAlt3 onClick={toggleMenu} className="cursor-pointer transition-all" size={30} />
            )}
          </div>
        </div>
      </div>
      <ResponsiveMenu showMenu={showMenu} user={user} />
    </div>
  );
};

export default Navbar;
