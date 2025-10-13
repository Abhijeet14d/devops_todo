import { Router } from "express";
import { body, param } from "express-validator";
import {
	createTodo,
	getTodos,
	getTodoById,
	updateTodo,
	deleteTodo,
} from "../controllers/todoController.js";
import { protect } from "../middlewares/protect.js";

const router = Router();

router.use(protect);

router
	.route("/")
	.get(getTodos)
	.post(
		[
			body("title").trim().notEmpty().withMessage("Title is required"),
			body("description").optional().isString(),
			body("dueDate").optional().isISO8601().toDate(),
		],
		createTodo
	);

router
	.route("/:id")
	.get(param("id").isMongoId().withMessage("Invalid todo id"), getTodoById)
	.put(
		[
			param("id").isMongoId().withMessage("Invalid todo id"),
			body("title").optional().isString(),
			body("description").optional().isString(),
			body("status")
				.optional()
				.isIn(["pending", "in-progress", "completed"])
				.withMessage("Invalid status"),
			body("dueDate").optional().isISO8601().toDate(),
		],
		updateTodo
	)
	.delete(param("id").isMongoId().withMessage("Invalid todo id"), deleteTodo);

export default router;
