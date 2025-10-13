import { useEffect, useState } from "react";
import FormInput from "./FormInput.jsx";
import PrimaryButton from "./PrimaryButton.jsx";

const TodoModal = ({ open, onClose, todo, onSave }) => {
  const [title, setTitle] = useState(todo?.title ?? "");
  const [description, setDescription] = useState(todo?.description ?? "");
  const [status, setStatus] = useState(todo?.status ?? "pending");
  const [dueDate, setDueDate] = useState(() => (todo?.dueDate ? todo.dueDate.substring(0, 16) : ""));

  useEffect(() => {
    if (open) {
      setTitle(todo?.title ?? "");
      setDescription(todo?.description ?? "");
      setStatus(todo?.status ?? "pending");
      setDueDate(todo?.dueDate ? todo.dueDate.substring(0, 16) : "");
    }
  }, [open, todo]);

  if (!open) return null;

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave({
      title,
      description,
      status,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-100">Edit Todo</h2>
          <button
            onClick={onClose}
            className="text-sm text-slate-400 transition hover:text-slate-100"
          >
            Close
          </button>
        </div>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <FormInput
            label="Title"
            name="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
            maxLength={200}
          />
          <label className="block text-sm font-medium text-slate-200">
            <span className="mb-2 block">Description</span>
            <textarea
              className="h-28 w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
              name="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              maxLength={2000}
            />
          </label>
          <label className="block text-sm font-medium text-slate-200">
            <span className="mb-2 block">Status</span>
            <select
              className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In progress</option>
              <option value="completed">Completed</option>
            </select>
          </label>
          <label className="block text-sm font-medium text-slate-200">
            <span className="mb-2 block">Due date</span>
            <input
              type="datetime-local"
              className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
              value={dueDate ?? ""}
              onChange={(event) => setDueDate(event.target.value)}
            />
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 hover:border-slate-500"
            >
              Cancel
            </button>
            <PrimaryButton type="submit">Save changes</PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TodoModal;
