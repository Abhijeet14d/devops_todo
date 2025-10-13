import { useEffect, useMemo, useState } from "react";
import AppHeader from "../components/AppHeader.jsx";
import FormInput from "../components/FormInput.jsx";
import PrimaryButton from "../components/PrimaryButton.jsx";
import Alert from "../components/Alert.jsx";
import TodoCard from "../components/TodoCard.jsx";
import TodoModal from "../components/TodoModal.jsx";
import useAuth from "../hooks/useAuth.js";
import {
  createTodo,
  deleteTodo,
  fetchTodos,
  updateTodo,
} from "../services/api.js";

const statusFilters = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "In progress", value: "in-progress" },
  { label: "Completed", value: "completed" },
];

const Dashboard = () => {
  const { token } = useAuth();
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ title: "", description: "", dueDate: "" });
  const [filter, setFilter] = useState("all");
  const [modal, setModal] = useState({ open: false, todo: null });
  const [busyTodoId, setBusyTodoId] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchTodos(token);
        setTodos(data);
      } catch (err) {
        setError(err.message || "Unable to load todos");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      load();
    }
  }, [token]);

  const filteredTodos = useMemo(() => {
    if (filter === "all") return todos;
    return todos.filter((todo) => todo.status === filter);
  }, [todos, filter]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => setForm({ title: "", description: "", dueDate: "" });

  const handleCreate = async (event) => {
    event.preventDefault();
    setError(null);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : undefined,
      };
      const todo = await createTodo(token, payload);
      setTodos((prev) => [todo, ...prev]);
      resetForm();
    } catch (err) {
      setError(err.message || "Unable to create todo");
    }
  };

  const handleStatusChange = async (todo, status) => {
    try {
      setBusyTodoId(todo._id);
      const updated = await updateTodo(token, todo._id, { status });
      setTodos((prev) => prev.map((item) => (item._id === todo._id ? updated : item)));
    } catch (err) {
      setError(err.message || "Unable to update todo status");
    } finally {
      setBusyTodoId(null);
    }
  };

  const handleDelete = async (todo) => {
    if (!confirm("Delete this todo?")) return;
    try {
      setBusyTodoId(todo._id);
      await deleteTodo(token, todo._id);
      setTodos((prev) => prev.filter((item) => item._id !== todo._id));
    } catch (err) {
      setError(err.message || "Unable to delete todo");
    } finally {
      setBusyTodoId(null);
    }
  };

  const openModal = (todo) => setModal({ open: true, todo });
  const closeModal = () => setModal({ open: false, todo: null });

  const handleModalSave = async (updates) => {
    if (!modal.todo) return;
    try {
      setBusyTodoId(modal.todo._id);
      const updated = await updateTodo(token, modal.todo._id, updates);
      setTodos((prev) => prev.map((item) => (item._id === modal.todo._id ? updated : item)));
      closeModal();
    } catch (err) {
      setError(err.message || "Unable to update todo");
    } finally {
      setBusyTodoId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <AppHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-10">
        <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 shadow">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold">Create a todo</h2>
              <p className="text-sm text-slate-400">Email notifications follow automatically.</p>
            </div>
          </div>
          <form onSubmit={handleCreate} className="mt-6 grid gap-4 lg:grid-cols-2">
            <FormInput
              label="Title"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
            />
            <FormInput
              label="Due date"
              name="dueDate"
              type="datetime-local"
              value={form.dueDate}
              onChange={handleChange}
            />
            <label className="lg:col-span-2">
              <span className="mb-2 block text-sm font-medium text-slate-200">Description</span>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="h-24 w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
                placeholder="Optional context, links, or reminders"
              />
            </label>
            <div className="lg:col-span-2 flex justify-end">
              <PrimaryButton type="submit">Add todo</PrimaryButton>
            </div>
          </form>
          {error && <Alert variant="error" title="Heads up" message={error} className="mt-4" />}
        </section>

        <section className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold">Your todos</h2>
              <p className="text-sm text-slate-400">Track progress and keep work flowing.</p>
            </div>
            <div className="flex gap-2 rounded-full border border-slate-800 bg-slate-900/70 p-1 text-xs">
              {statusFilters.map((item) => (
                <button
                  key={item.value}
                  onClick={() => setFilter(item.value)}
                  className={`rounded-full px-4 py-1 font-medium transition ${
                    filter === item.value ? "bg-sky-500 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <p className="text-sm text-slate-400">Loading your tasks...</p>
          ) : filteredTodos.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-10 text-center text-sm text-slate-400">
              Nothing here yet. Create a todo to see it appear here.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2">
              {filteredTodos.map((todo) => (
                <div key={todo._id} className={busyTodoId === todo._id ? "animate-pulse" : ""}>
                  <TodoCard
                    todo={todo}
                    onDelete={() => handleDelete(todo)}
                    onStatusChange={(status) => handleStatusChange(todo, status)}
                    onEdit={() => openModal(todo)}
                  />
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <TodoModal
        open={modal.open}
        todo={modal.todo}
        onClose={closeModal}
        onSave={handleModalSave}
      />
    </div>
  );
};

export default Dashboard;
