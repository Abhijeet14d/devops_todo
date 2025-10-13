import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./utils/db.js";
import authRoutes from "./routes/auth.js";
import todoRoutes from "./routes/todo.js";
import { notFound, errorHandler } from "./middlewares/errorHandler.js";

const app = express();

if (!process.env.MONGODB_URI) {
  console.warn("MONGODB_URI is not set. Update your .env file before starting the server.");
}

const PORT = process.env.PORT || 5000;

await connectDB();

const allowedOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins.length ? allowedOrigins : undefined,
    credentials: allowedOrigins.length > 0,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
