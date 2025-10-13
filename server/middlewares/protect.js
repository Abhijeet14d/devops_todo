import jwt from "jsonwebtoken";
import User from "../models/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const protect = asyncHandler(async (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return res.status(401).json({ message: "Authentication required" });
	}

	const token = authHeader.split(" ")[1];

	if (!process.env.JWT_SECRET) {
		throw new Error("JWT_SECRET is not configured");
	}

	const decoded = jwt.verify(token, process.env.JWT_SECRET);
	const user = await User.findById(decoded.id);

	if (!user) {
		return res.status(401).json({ message: "User not found" });
	}

	if (!user.isVerified) {
		return res.status(403).json({ message: "Verify your email to access this resource" });
	}

	req.user = { id: user._id.toString(), email: user.email, name: user.name };
	next();
});
