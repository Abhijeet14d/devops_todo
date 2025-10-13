import StatusBadge from "./StatusBadge.jsx";
import PrimaryButton from "./PrimaryButton.jsx";

const formatDate = (value) => {
  if (!value) return "No due date";
  const date = new Date(value);
  return date.toLocaleString();
};

const nextStatus = {
  pending: "in-progress",
  "in-progress": "completed",
  completed: "pending",
};

const statusActionLabel = {
  pending: "Start",
  "in-progress": "Complete",
  completed: "Reset",
};

const TodoCard = ({ todo, onDelete, onStatusChange, onEdit }) => {
  const { title, description, status, dueDate, createdAt, completedAt } = todo;

  const handleStatusChange = () => {
    const updatedStatus = nextStatus[status] || "pending";
    onStatusChange(updatedStatus);
  };

  return (
    <article className="group flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-5 shadow transition hover:border-sky-500/40 hover:shadow-sky-500/10">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
          <p className="mt-1 text-xs text-slate-400">Created {formatDate(createdAt)}</p>
        </div>
        <StatusBadge status={status} />
      </div>
      {description && <p className="text-sm text-slate-300">{description}</p>}
      <dl className="grid grid-cols-2 gap-3 text-xs text-slate-400 sm:grid-cols-3">
        <div>
          <dt className="font-semibold text-slate-300">Due</dt>
          <dd>{formatDate(dueDate)}</dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-300">Completed</dt>
          <dd>{completedAt ? formatDate(completedAt) : "Not yet"}</dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-300">Status action</dt>
          <dd>{statusActionLabel[status]}</dd>
        </div>
      </dl>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <PrimaryButton onClick={handleStatusChange} className="px-3 py-1 text-xs">
          {statusActionLabel[status]}
        </PrimaryButton>
        <button
          onClick={onEdit}
          className="text-xs font-medium text-slate-400 underline-offset-2 hover:text-slate-200 hover:underline"
        >
          Edit details
        </button>
        <button
          onClick={onDelete}
          className="text-xs font-medium text-rose-400 underline-offset-2 hover:text-rose-200 hover:underline"
        >
          Delete
        </button>
      </div>
    </article>
  );
};

export default TodoCard;
