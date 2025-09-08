import React from "react";
import { FaUserCircle } from "react-icons/fa";
import { Navlinks } from "./Navbar"; // pretpostavka: Navlinks ima npr. {name, link, auth?: true}

const ResponsiveMenu = ({ showMenu, user }) => {
  return (
    <div
      className={`${
        showMenu ? "left-0" : "-left-[100%]"
      } fixed bottom-0 top-0 z-20 h-screen w-[75%] md:hidden
         bg-white dark:bg-gray-900 dark:text-white text-black
         px-8 pb-6 pt-16 transition-all duration-200 rounded-r-xl shadow-md flex flex-col justify-between`}
    >
      <div>
        <div className="flex items-center gap-3">
          <FaUserCircle size={44} />
          <div>
            <div className="font-semibold">
              {user ? user.email : "Gost"}
            </div>
            <div className="text-xs text-slate-500">
              {user ? (user.isAdmin ? "Admin" : "Korisnik") : "Nije prijavljen"}
            </div>
          </div>
        </div>

        <nav className="mt-10">
          <ul className="space-y-4 text-lg">
            {Navlinks.map(({ id, name, link, auth }) => {
              // pokaži samo ako nema auth zahtjeva ili je user prisutan
              if (auth && !user) return null;
              return (
                <li key={id}>
                  <a href={link} className="inline-block hover:text-primary">
                    {name}
                  </a>
                </li>
              );
            })}

            {/* Admin panel (samo admin) */}
            {user?.isAdmin && (
              <li>
                <a href="/admin-panel" className="inline-block hover:text-primary">
                  ADMIN PANEL
                </a>
              </li>
            )}

            {/* Dashboard (samo logirani) */}
            {user && (
              <li>
                <a href="/dashboard" className="inline-block hover:text-primary">
                  DASHBOARD
                </a>
              </li>
            )}

            {/* Auth linkovi (ako NIJE logiran) */}
            {!user && (
              <>
                <li><a href="/login" className="inline-block hover:text-primary">LOGIN</a></li>
                <li><a href="/signup" className="inline-block hover:text-primary">SIGNUP</a></li>
              </>
            )}
          </ul>
        </nav>
      </div>

      <div className="text-sm opacity-70">ChatGPT Travel Planner</div>
    </div>
  );
};

export default ResponsiveMenu;
