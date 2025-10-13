import { Link } from "react-router-dom";
import Logo from "../components/Logo.jsx";

const NotFound = () => (
  <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-6 py-12 text-center text-slate-100">
    <Logo />
    <h1 className="mt-8 text-4xl font-bold">Page not found</h1>
    <p className="mt-3 max-w-md text-sm text-slate-400">
      The link you followed is not available. Double-check the URL or head back to the dashboard.
    </p>
    <Link
      to="/"
      className="mt-6 inline-flex items-center justify-center rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-sky-400"
    >
      Return home
    </Link>
  </div>
);

export default NotFound;
