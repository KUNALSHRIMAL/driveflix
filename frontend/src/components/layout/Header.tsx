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
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-black/80 backdrop-blur">
      <div className="mx-auto flex h-24 items-center gap-6 px-8 lg:px-12">
        <NavLink to="/" data-tv-focus-key="header-home" className="shrink-0 text-4xl font-bold text-red-600">
          DriveFlix
        </NavLink>

        <nav className="hidden items-center gap-8 lg:flex">
          {navigation.filter((item) => item.path !== "/search").map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              data-tv-focus-key={`header-${item.label.toLowerCase().replace(" ", "-")}`}
              className={({ isActive }) =>
                `transition-colors ${
                  isActive ? "text-white" : "text-zinc-400 hover:text-white"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <form onSubmit={submitSearch} className="ml-auto flex min-w-0 max-w-md flex-1">
          <label className="flex h-14 w-full items-center gap-3 rounded-full border border-zinc-700 bg-zinc-900/90 px-5 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-600">
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

        <div className="relative">
          <button
            type="button"
            onClick={() => setProfileOpen((open) => !open)}
            aria-label="Open profile menu"
            aria-expanded={profileOpen}
            data-tv-focus-key="header-profile"
            className="flex min-h-14 items-center gap-3 rounded-full px-2 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-600"
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
            <span className="hidden text-zinc-300 xl:block">
              {user?.name ?? "Guest"}
            </span>
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-14 w-48 rounded-xl border border-zinc-700 bg-zinc-900 p-2 shadow-2xl">
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
