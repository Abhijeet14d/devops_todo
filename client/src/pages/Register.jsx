import { useState } from "react";
import { Link } from "react-router-dom";
import FormInput from "../components/FormInput.jsx";
import PrimaryButton from "../components/PrimaryButton.jsx";
import Alert from "../components/Alert.jsx";
import Logo from "../components/Logo.jsx";
import { registerUser, resendVerification } from "../services/api.js";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await registerUser(form);
      setMessage(response.message || "Registration successful. Check your inbox to verify.");
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await resendVerification({ email: form.email });
      setMessage(response.message || "Verification email sent.");
    } catch (err) {
      setError(err.message || "Unable to resend verification email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-6 py-12 text-slate-100">
      <div className="w-full max-w-md rounded-3xl border border-slate-800/80 bg-slate-900/70 p-8 shadow-xl">
        <div className="text-center">
          <Logo />
          <h1 className="mt-6 text-2xl font-semibold">Create your account</h1>
          <p className="mt-2 text-sm text-slate-400">Join DevOps Todo and turn plans into progress.</p>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <FormInput
            label="Full name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            autoComplete="name"
          />
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
            autoComplete="new-password"
          />
          <PrimaryButton type="submit" className="w-full" disabled={loading}>
            {loading ? "Working..." : "Create account"}
          </PrimaryButton>
        </form>
        <div className="mt-6 space-y-3">
          {message && <Alert variant="success" title="Success" message={message} />}
          {error && <Alert variant="error" title="Error" message={error} />}
        </div>
        <div className="mt-6 flex items-center justify-between text-xs text-slate-400">
          <button
            onClick={handleResend}
            disabled={!form.email || loading}
            className="font-semibold text-slate-300 underline-offset-2 hover:text-white hover:underline disabled:cursor-not-allowed"
          >
            Resend verification email
          </button>
          <Link className="font-semibold text-slate-300 underline-offset-2 hover:text-white hover:underline" to="/login">
            Have an account?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
