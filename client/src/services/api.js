const sanitizeBase = (value) => (value ? value.replace(/\/$/, "") : value);

const inferBaseFromWindow = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const origin = window.location.origin;
  return `${origin}/api`;
};

const apiBaseCandidate = import.meta.env.VITE_API_URL || inferBaseFromWindow() || "http://localhost:5000/api";

const API_BASE = sanitizeBase(apiBaseCandidate);

const buildHeaders = (token, extraHeaders = {}) => {
  const headers = { "Content-Type": "application/json", ...extraHeaders };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

const parseResponse = async (response) => {
  const contentType = response.headers.get("content-type");
  const isJSON = contentType && contentType.includes("application/json");
  const payload = isJSON ? await response.json() : await response.text();

  if (!response.ok) {
    const message = (payload && payload.message) || response.statusText || "Request failed";
    const error = new Error(message);
    error.status = response.status;
    error.data = payload;
    throw error;
  }

  return payload;
};

const request = async (path, { method = "GET", data, token, headers } = {}) => {
  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers: buildHeaders(token, headers),
    body: typeof data !== "undefined" ? JSON.stringify(data) : undefined,
  });

  return parseResponse(response);
};

export const registerUser = (payload) => request("/auth/register", { method: "POST", data: payload });

export const resendVerification = (payload) => request("/auth/resend-verification", { method: "POST", data: payload });

export const verifyEmailToken = (token) => request(`/auth/verify-email?token=${encodeURIComponent(token)}`);

export const loginUser = (payload) => request("/auth/login", { method: "POST", data: payload });

export const googleLogin = (payload) => request("/auth/google", { method: "POST", data: payload });

export const fetchCurrentUser = (token) => request("/auth/me", { token });

export const fetchTodos = (token) => request("/todos", { token });

export const createTodo = (token, payload) => request("/todos", { method: "POST", data: payload, token });

export const updateTodo = (token, id, payload) => request(`/todos/${id}`, { method: "PUT", data: payload, token });

export const deleteTodo = (token, id) => request(`/todos/${id}`, { method: "DELETE", token });
