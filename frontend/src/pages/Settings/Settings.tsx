import { NavLink } from "react-router-dom";

const Settings = () => (
  <section className="flex min-h-[calc(100vh-6rem)] flex-col items-center justify-center gap-6 px-12 text-center">
    <h1 className="text-6xl font-bold text-white">Settings</h1>
    <p className="text-2xl text-zinc-400">Manage your account from the profile menu.</p>
    <NavLink
      to="/"
      data-tv-focus-key="settings-home"
      className="rounded-xl bg-red-600 px-10 py-4 text-xl font-semibold text-white"
    >
      Back to Home
    </NavLink>
  </section>
);

export default Settings;
