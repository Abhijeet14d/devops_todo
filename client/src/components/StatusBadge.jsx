const palette = {
  pending: "bg-amber-500/15 text-amber-300 border border-amber-500/30",
  "in-progress": "bg-sky-500/15 text-sky-200 border border-sky-500/30",
  completed: "bg-emerald-500/15 text-emerald-200 border border-emerald-500/30",
};

const StatusBadge = ({ status }) => (
  <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium capitalize ${palette[status] || palette.pending}`}>
    {status.replace("-", " ")}
  </span>
);

export default StatusBadge;
