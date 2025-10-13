const PrimaryButton = ({ children, type = "button", className = "", ...rest }) => (
  <button
    type={type}
    className={`inline-flex items-center justify-center rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:cursor-not-allowed disabled:bg-slate-600 ${className}`}
    {...rest}
  >
    {children}
  </button>
);

export default PrimaryButton;
