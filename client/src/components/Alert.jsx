const variants = {
  success: "border-emerald-500/40 bg-emerald-500/10 text-emerald-200",
  error: "border-rose-500/40 bg-rose-500/10 text-rose-200",
  info: "border-sky-500/40 bg-sky-500/10 text-sky-200",
  warning: "border-amber-500/40 bg-amber-500/10 text-amber-200",
};

const Alert = ({ variant = "info", title, message, className = "" }) => (
  <div className={`rounded-lg border px-4 py-3 text-sm ${variants[variant]} ${className}`}>
    {title && <p className="font-semibold">{title}</p>}
    {message && <p className="mt-1 text-xs leading-relaxed">{message}</p>}
  </div>
);

export default Alert;
