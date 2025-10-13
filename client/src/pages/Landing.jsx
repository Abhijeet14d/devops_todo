import { Link, Navigate } from "react-router-dom";
import Logo from "../components/Logo.jsx";
import PrimaryButton from "../components/PrimaryButton.jsx";
import useAuth from "../hooks/useAuth.js";

const features = [
  "Simple planning with realtime status",
  "Email nudges for key milestones",
  "Secure authentication with verification",
];

const Landing = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/app" replace />;
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center justify-center gap-16 px-6 py-12 text-slate-100">
      <div className="text-center">
        <Logo size="text-4xl" />
        <p className="mt-6 text-4xl font-bold leading-tight text-slate-50 sm:text-5xl">
          Stay on track with a focused todo workspace.
        </p>
        <p className="mx-auto mt-4 max-w-2xl text-base text-slate-300">
          Manage your personal tasks with a streamlined dashboard, instant email confirmations, and meaningful progress updates.
        </p>
      </div>
      <div className="grid gap-4 text-left sm:grid-cols-3">
        {features.map((feature) => (
          <div key={feature} className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 shadow">
            <p className="text-base font-semibold text-slate-100">{feature}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          to="/register"
          className="inline-flex items-center justify-center rounded-lg bg-sky-500 px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-950"
        >
          Create an account
        </Link>
        <Link
          to="/login"
          className="text-sm font-semibold text-slate-300 underline-offset-4 hover:text-white hover:underline"
        >
          I already have an account
        </Link>
      </div>
    </div>
  );
};

export default Landing;
