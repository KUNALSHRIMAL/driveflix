import { useState, type FormEvent } from "react";
import { LogIn, LogOut, Search, UserRound } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

import { navigation } from "@/constants/navigation";
import { useAuth } from "@/hooks/useAuth";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = query.trim();
    navigate(value ? `/search?q=${encodeURIComponent(value)}` : "/search");
  };

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate("/login");
  };

  return (
    <header className="fixed inset-y-0 left-0 z-40 w-24 border-r border-zinc-800 bg-black/90 backdrop-blur lg:w-72">
      <div className="flex h-full flex-col gap-8 px-3 py-8 lg:px-6">
        <NavLink
          to="/"
          data-tv-focus-key="header-home"
          className="shrink-0 text-center text-4xl font-bold text-red-600 lg:text-left"
        >
          <span className="lg:hidden">D</span>
          <span className="hidden lg:inline">DriveFlix</span>
        </NavLink>

        <nav className="flex flex-col gap-3">
          {navigation.filter((item) => item.path !== "/search").map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              data-tv-focus-key={`header-${item.label.toLowerCase().replace(" ", "-")}`}
              className={({ isActive }) =>
                `flex min-h-14 items-center rounded-xl px-3 text-lg transition-colors lg:px-5 ${
                  isActive
                    ? "bg-zinc-800 text-white"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                }`
              }
            >
              <span className="hidden lg:inline">{item.label}</span>
              <span className="mx-auto text-xl font-bold lg:hidden">
                {item.label.charAt(0)}
              </span>
            </NavLink>
          ))}
        </nav>

        <form onSubmit={submitSearch} className="w-full">
          <button
            type="submit"
            aria-label="Open search"
            data-tv-focus-key="header-search-mobile"
            className="flex h-14 w-full items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900/90 lg:hidden"
          >
            <Search className="size-6 text-zinc-300" />
          </button>
          <label className="hidden h-14 w-full items-center gap-3 rounded-xl border border-zinc-700 bg-zinc-900/90 px-5 transition focus-within:border-violet-300 focus-within:ring-4 focus-within:ring-violet-500/30 lg:flex">
            <Search className="size-5 shrink-0 text-zinc-400" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search movies"
              aria-label="Search movies"
              data-tv-focus-key="header-search"
              className="min-w-0 flex-1 bg-transparent text-lg text-white outline-none placeholder:text-zinc-500"
            />
          </label>
        </form>

        <div className="relative mt-auto">
          <button
            type="button"
            onClick={() => setProfileOpen((open) => !open)}
            aria-label="Open profile menu"
            aria-expanded={profileOpen}
            data-tv-focus-key="header-profile"
            className="flex min-h-16 w-full items-center justify-center gap-3 rounded-xl px-2 hover:bg-zinc-900 focus-visible:outline-none lg:justify-start"
          >
            {user?.picture ? (
              <img
                src={user.picture}
                alt={user.name}
                className="h-12 w-12 rounded-full object-cover"
              />
            ) : (
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800">
                <UserRound className="size-5" />
              </span>
            )}
            <span className="hidden truncate text-zinc-300 lg:block">
              {user?.name ?? "Guest"}
            </span>
          </button>

          {profileOpen && (
            <div className="absolute bottom-20 left-0 w-56 rounded-xl border border-zinc-700 bg-zinc-900 p-2 shadow-2xl">
              {user ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  data-tv-focus-key="profile-logout"
                  className="flex min-h-14 w-full items-center gap-3 rounded-lg px-4 text-left text-lg text-zinc-200 hover:bg-zinc-800"
                >
                  <LogOut className="size-4" />
                  Logout
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    navigate("/login");
                  }}
                  data-tv-focus-key="profile-login"
                  className="flex min-h-14 w-full items-center gap-3 rounded-lg px-4 text-left text-lg text-zinc-200 hover:bg-zinc-800"
                >
                  <LogIn className="size-4" />
                  Login
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
