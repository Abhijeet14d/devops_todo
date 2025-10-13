import { Router } from "express";
import { body } from "express-validator";
import {
	register,
	verifyEmail,
	resendVerification,
	login,
	googleAuth,
	me,
} from "../controllers/auth.js";
import { protect } from "../middlewares/protect.js";

const router = Router();

router.post(
	"/register",
	[
		body("name").trim().notEmpty().withMessage("Name is required"),
		body("email").isEmail().withMessage("Valid email is required"),
		body("password")
			.isLength({ min: 8 })
			.withMessage("Password must be at least 8 characters"),
	],
	register
);

router.get("/verify-email", verifyEmail);

router.post("/resend-verification", [body("email").isEmail().withMessage("Valid email is required")], resendVerification);

router.post(
	"/login",
	[
		body("email").isEmail().withMessage("Valid email is required"),
		body("password").notEmpty().withMessage("Password is required"),
	],
	login
);

router.post(
	"/google",
	[body("idToken").notEmpty().withMessage("Google ID token is required")],
	googleAuth
);

router.get("/me", protect, me);

export default router;
