import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Logo from "../components/Logo.jsx";
import Alert from "../components/Alert.jsx";
import PrimaryButton from "../components/PrimaryButton.jsx";
import { resendVerification, verifyEmailToken } from "../services/api.js";
import useAuth from "../hooks/useAuth.js";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState({ state: "idle" });
  const [email, setEmail] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setStatus({ state: "error", message: "Verification token is missing." });
      return;
    }

    const verify = async () => {
      setStatus({ state: "loading" });
      try {
        const response = await verifyEmailToken(token);
        setStatus({ state: "success", message: "Email verified successfully! Redirecting..." });
        if (response?.user?.email) {
          setEmail(response.user.email);
        }
        
        // Store the token and redirect to dashboard
        if (response?.token) {
          localStorage.setItem("devopsapp_auth_token", response.token);
          setTimeout(() => {
            navigate("/app", { replace: true });
          }, 1500);
        }
      } catch (err) {
        setStatus({ state: "error", message: err.message || "Verification failed." });
      }
    };

    verify();
  }, [searchParams, navigate]);

  const handleResend = async () => {
    if (!email) {
      setStatus({ state: "error", message: "Provide your email to resend verification." });
      return;
    }

    setStatus({ state: "loading" });
    try {
      const response = await resendVerification({ email });
      setStatus({ state: "info", message: response.message || "Verification email resent." });
    } catch (err) {
      setStatus({ state: "error", message: err.message || "Unable to resend verification." });
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-6 py-12 text-slate-100">
      <div className="w-full max-w-lg space-y-6 rounded-3xl border border-slate-800/80 bg-slate-900/70 p-10 text-center shadow-xl">
        <Logo />
        <h1 className="text-2xl font-semibold">Verifying your email</h1>
        {status.state === "loading" && <p className="animate-pulse text-sm text-slate-400">Confirming your details...</p>}
        {status.state === "success" && (
          <Alert variant="success" title="Success" message={status.message} />
        )}
        {status.state === "info" && <Alert variant="info" title="Heads up" message={status.message} />}
        {status.state === "error" && <Alert variant="error" title="Error" message={status.message} />}
        {status.state === "success" && (
          <p className="text-sm text-slate-400 animate-pulse">Redirecting to dashboard...</p>
        )}
        {status.state !== "success" && (
          <div className="space-y-3 text-sm text-slate-300">
            <p>Did not get the email? Enter your address and resend.</p>
            <input
              type="email"
              className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <PrimaryButton onClick={handleResend} className="w-full">
              Resend verification email
            </PrimaryButton>
          </div>
        )}
        <p className="text-xs text-slate-500">
          Verification links expire after 24 hours. Submit the form again if you need a fresh link.
        </p>
      </div>
    </div>
  );
};

export default VerifyEmail;
