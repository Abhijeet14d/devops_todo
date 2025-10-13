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
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20"></div>
      
      {/* Gradient orbs for depth */}
      <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-sky-500/10 blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl"></div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center justify-center gap-16 px-6 py-12">
        <div className="text-center">
          <Logo size="text-4xl" />
          <p className="mt-6 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            Stay on track with a focused{" "}
            <span className="bg-gradient-to-r from-sky-400 to-purple-400 bg-clip-text text-transparent">
              todo workspace
            </span>
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
            Manage your personal tasks with a streamlined dashboard, instant email confirmations, and meaningful progress updates.
          </p>
        </div>

        <div className="grid w-full gap-6 sm:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature}
              className="group relative overflow-hidden rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-900/80 to-slate-900/40 p-8 shadow-2xl backdrop-blur-sm transition-all duration-300 hover:border-sky-500/30 hover:shadow-sky-500/10"
            >
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-sky-500/5 transition-transform duration-500 group-hover:scale-150"></div>
              <div className="relative">
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-base font-semibold text-slate-200 group-hover:text-white transition-colors">
                  {feature}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/register"
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-sky-500 to-purple-500 px-8 py-4 text-base font-semibold text-white shadow-2xl shadow-sky-500/25 transition-all duration-300 hover:scale-105 hover:shadow-sky-500/40 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-slate-950"
          >
            <span className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
            <span className="relative">Create an account</span>
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900/50 px-8 py-4 text-base font-semibold text-slate-300 backdrop-blur-sm transition-all duration-300 hover:border-slate-600 hover:bg-slate-800/50 hover:text-white focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2 focus:ring-offset-slate-950"
          >
            I already have an account
          </Link>
        </div>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sky-500/50 to-transparent"></div>
      </div>
    </div>
  );
};

export default Landing;