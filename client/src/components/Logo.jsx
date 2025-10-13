const Logo = ({ size = "text-2xl" }) => (
  <div className={`font-semibold tracking-tight ${size}`}>
    <span className="text-sky-400">Dev</span>
    <span className="text-white">Ops</span>
    <span className="text-sky-400">Todo</span>
  </div>
);

export default Logo;
