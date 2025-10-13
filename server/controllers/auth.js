import crypto from "crypto";
import { validationResult } from "express-validator";
import { OAuth2Client } from "google-auth-library";
import User from "../models/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendEmail } from "../utils/email.js";

const verificationTokenTTL = 1000 * 60 * 60 * 24; // 24 hours
const googleClient = process.env.GOOGLE_CLIENT_ID
	? new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
	: null;

const buildVerificationLink = (token) => {
	const baseUrl = process.env.CLIENT_URL || "http://localhost:3000";
	const url = new URL("/verify-email", baseUrl);
	url.searchParams.set("token", token);
	return url.toString();
};

const sendVerificationEmail = async (email, token) => {
	const verificationLink = buildVerificationLink(token);
	await sendEmail({
		to: email,
		subject: "Verify your DevopsApp account",
		html: `
			<p>Welcome! Please verify your email to finish setting up your account.</p>
			<p><a href="${verificationLink}">Verify email</a></p>
			<p>This link expires in 24 hours.</p>
		`,
	});
};

const respondWithAuth = (res, user, statusCode = 200) => {
	const token = user.generateJWT();
	res.status(statusCode).json({
		token,
		user: {
			id: user._id,
			name: user.name,
			email: user.email,
			isVerified: user.isVerified,
			provider: user.googleId ? "google" : "local",
		},
	});
};

export const register = asyncHandler(async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const { name, email, password } = req.body;

	const existingUser = await User.findOne({ email });
	if (existingUser) {
		return res.status(409).json({ message: "Email is already registered" });
	}

	const verificationToken = crypto.randomBytes(32).toString("hex");
	const verificationTokenHash = crypto.createHash("sha256").update(verificationToken).digest("hex");
	const verificationTokenExpires = new Date(Date.now() + verificationTokenTTL);

	const user = await User.create({
		name,
		email,
		password,
		verificationTokenHash,
		verificationTokenExpires,
		lastVerificationTokenHash: verificationTokenHash,
	});

	await sendVerificationEmail(email, verificationToken);

	res.status(201).json({ message: "Registration successful. Check your inbox to verify your email." });
});

export const verifyEmail = asyncHandler(async (req, res) => {
	const { token } = req.query;

	if (!token) {
		return res.status(400).json({ message: "Verification token is required" });
	}

	const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

	const user = await User.findOne({
		verificationTokenHash: hashedToken,
		verificationTokenExpires: { $gt: new Date() },
	});

	if (!user) {
		return res.status(400).json({ message: "Invalid or expired verification token" });
	}

	user.isVerified = true;
	user.verificationTokenHash = undefined;
	user.verificationTokenExpires = undefined;
	user.verificationTokenUsedAt = new Date();
	user.lastVerificationTokenHash = hashedToken;
	await user.save();

	respondWithAuth(res, user);
});

export const resendVerification = asyncHandler(async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const { email } = req.body;
	if (!email) {
		return res.status(400).json({ message: "Email is required" });
	}

	const user = await User.findOne({ email });
	if (!user) {
		return res.status(404).json({ message: "User not found" });
	}

	if (user.isVerified) {
		return res.status(400).json({ message: "Account is already verified" });
	}

	const verificationToken = crypto.randomBytes(32).toString("hex");
	user.verificationTokenHash = crypto.createHash("sha256").update(verificationToken).digest("hex");
	user.verificationTokenExpires = new Date(Date.now() + verificationTokenTTL);
	user.lastVerificationTokenHash = user.verificationTokenHash;
	user.verificationTokenUsedAt = undefined;
	await user.save();

	await sendVerificationEmail(email, verificationToken);

	res.json({ message: "Verification email sent" });
});

export const login = asyncHandler(async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const { email, password } = req.body;

	const user = await User.findOne({ email }).select("+password");
	if (!user) {
		return res.status(401).json({ message: "Invalid credentials" });
	}

	if (!user.isVerified) {
		return res.status(403).json({ message: "Please verify your email before logging in" });
	}

	const isMatch = await user.comparePassword(password);
	if (!isMatch) {
		return res.status(401).json({ message: "Invalid credentials" });
	}

	respondWithAuth(res, user);
});

export const googleAuth = asyncHandler(async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const { idToken } = req.body;

	if (!process.env.GOOGLE_CLIENT_ID) {
		return res.status(500).json({ message: "Google auth is not configured" });
	}

	if (!googleClient) {
		return res.status(500).json({ message: "Google auth client could not be initialized" });
	}

	if (!idToken) {
		return res.status(400).json({ message: "Google ID token is required" });
	}

	const ticket = await googleClient.verifyIdToken({
		idToken,
		audience: process.env.GOOGLE_CLIENT_ID,
	});

	const payload = ticket.getPayload();
	if (!payload?.email) {
		return res.status(400).json({ message: "Google token did not include an email" });
	}

	let user = await User.findOne({ email: payload.email });

	if (!user) {
		user = await User.create({
			name: payload.name || payload.email.split("@")[0],
			email: payload.email,
			password: crypto.randomBytes(32).toString("hex"),
			googleId: payload.sub,
			isVerified: true,
		});
	} else if (!user.googleId) {
		user.googleId = payload.sub;
		user.isVerified = true;
		await user.save();
	}

	respondWithAuth(res, user);
});

export const me = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user.id).select("-password");
	res.json({ user });
});
