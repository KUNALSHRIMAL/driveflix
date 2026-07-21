import { NavLink } from "react-router-dom";
import { navigation } from "@/constants/navigation";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-black/80 backdrop-blur">
      <div className="mx-auto flex h-20 items-center justify-between px-8">
        {/* Logo */}
        <NavLink
          to="/"
          className="text-4xl font-bold text-red-600"
        >
          DriveFlix
        </NavLink>

        {/* Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {navigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `transition-colors ${
                  isActive
                    ? "text-white"
                    : "text-zinc-400 hover:text-white"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-sm font-semibold">
            G
          </div>

          <span className="hidden text-zinc-300 md:block">
            Guest
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;