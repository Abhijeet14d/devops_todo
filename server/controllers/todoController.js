import { validationResult } from "express-validator";
import Todo from "../models/todoModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendEmail } from "../utils/email.js";

const sendTodoNotification = async ({ to, subject, todo }) => {
  await sendEmail({
    to,
    subject,
    html: `
      <p>${subject}</p>
      <ul>
        <li><strong>Title:</strong> ${todo.title}</li>
        ${todo.description ? `<li><strong>Description:</strong> ${todo.description}</li>` : ""}
        ${todo.dueDate ? `<li><strong>Due:</strong> ${new Date(todo.dueDate).toLocaleString()}</li>` : ""}
        <li><strong>Status:</strong> ${todo.status}</li>
      </ul>
    `,
  });
};

export const createTodo = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, description, dueDate } = req.body;
  const todo = await Todo.create({
    user: req.user.id,
    title,
    description,
    dueDate,
  });

  if (req.user.email) {
    try {
      await sendTodoNotification({
        to: req.user.email,
        subject: "New todo created",
        todo,
      });
    } catch (err) {
      console.warn("Failed to send todo creation email", err.message);
    }
  }

  res.status(201).json(todo);
});

export const getTodos = asyncHandler(async (req, res) => {
  const todos = await Todo.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(todos);
});

export const getTodoById = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const todo = await Todo.findOne({ _id: req.params.id, user: req.user.id });
  if (!todo) {
    return res.status(404).json({ message: "Todo not found" });
  }
  res.json(todo);
});

export const updateTodo = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const todo = await Todo.findOne({ _id: req.params.id, user: req.user.id });
  if (!todo) {
    return res.status(404).json({ message: "Todo not found" });
  }

  const previousStatus = todo.status;

  const updates = (({ title, description, status, dueDate }) => ({
    title,
    description,
    status,
    dueDate,
  }))(req.body);

  Object.entries(updates).forEach(([key, value]) => {
    if (typeof value !== "undefined") {
      todo[key] = value;
    }
  });

  if (todo.status === "completed" && previousStatus !== "completed") {
    todo.completedAt = new Date();
  }

  if (todo.status !== "completed" && previousStatus === "completed") {
    todo.completedAt = undefined;
  }

  await todo.save();

  if (req.user.email && previousStatus !== todo.status) {
    try {
      await sendTodoNotification({
        to: req.user.email,
        subject: `Todo marked ${todo.status}`,
        todo,
      });
    } catch (err) {
      console.warn("Failed to send todo status email", err.message);
    }
  }

  res.json(todo);
});

export const deleteTodo = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const todo = await Todo.findOneAndDelete({ _id: req.params.id, user: req.user.id });
  if (!todo) {
    return res.status(404).json({ message: "Todo not found" });
  }

  res.status(204).send();
});
