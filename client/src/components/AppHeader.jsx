import Logo from "./Logo.jsx";
import PrimaryButton from "./PrimaryButton.jsx";
import useAuth from "../hooks/useAuth.js";

const AppHeader = () => {
  const { user, logout } = useAuth();

  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/60 bg-slate-900/60 px-6 py-4 backdrop-blur">
      <div className="flex items-center gap-3">
        <Logo />
        <div className="hidden text-sm text-slate-400 sm:block">Stay organized and on schedule.</div>
      </div>
      <div className="flex items-center gap-3">
        {user && (
          <div className="text-right text-xs text-slate-300">
            <p className="font-semibold text-slate-100">{user.name}</p>
            <p>{user.email}</p>
          </div>
        )}
        <PrimaryButton onClick={logout} className="bg-rose-500 hover:bg-rose-400">
          Logout
        </PrimaryButton>
      </div>
    </header>
  );
};

export default AppHeader;
