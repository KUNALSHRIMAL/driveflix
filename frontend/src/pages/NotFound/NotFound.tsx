import { NavLink } from "react-router-dom";

const NotFound = () => (
  <section className="flex min-h-[calc(100vh-6rem)] flex-col items-center justify-center gap-6 px-12 text-center">
    <h1 className="text-7xl font-bold text-white">404</h1>
    <p className="text-2xl text-zinc-400">This page could not be found.</p>
    <NavLink
      to="/"
      data-tv-focus-key="not-found-home"
      className="rounded-xl bg-red-600 px-10 py-4 text-xl font-semibold text-white"
    >
      Back to Home
    </NavLink>
  </section>
);

export default NotFound;
