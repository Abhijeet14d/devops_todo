import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import FormInput from "../components/FormInput.jsx";
import PrimaryButton from "../components/PrimaryButton.jsx";
import Alert from "../components/Alert.jsx";
import Logo from "../components/Logo.jsx";
import useAuth from "../hooks/useAuth.js";

const Login = () => {
  const { login, isAuthenticated, setError, error } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/app" replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(form);
      navigate("/app", { replace: true });
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    alert("Google sign-in is not configured yet. Provide an ID token once frontend integration is ready.");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-6 py-12 text-slate-100">
      <div className="w-full max-w-md rounded-3xl border border-slate-800/80 bg-slate-900/70 p-8 shadow-xl">
        <div className="text-center">
          <Logo />
          <h1 className="mt-6 text-2xl font-semibold">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-400">Sign in to manage your tasks.</p>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <FormInput
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            autoComplete="email"
          />
          <FormInput
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
          />
          <PrimaryButton type="submit" className="w-full" disabled={loading}>
            {loading ? "Checking..." : "Sign in"}
          </PrimaryButton>
        </form>
        <PrimaryButton
          onClick={handleGoogle}
          className="mt-4 w-full border border-slate-700 bg-transparent text-slate-200 hover:bg-slate-800"
        >
          Continue with Google
        </PrimaryButton>
        <div className="mt-6 space-y-3">
          {error && <Alert variant="error" title="Error" message={error} />}
        </div>
        <div className="mt-6 text-center text-xs text-slate-400">
          Need an account?
          <Link className="ml-1 font-semibold text-slate-300 underline-offset-2 hover:text-white hover:underline" to="/register">
            Register now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
