# DevopsApp Todo API

Backend service for a full-featured todo list with email-based account verification, Google sign-in, and email notifications on todo milestones. Built with Express, MongoDB, Mongoose, JWT authentication, and Nodemailer.

## Prerequisites

- Node.js 18+
- npm or yarn
- MongoDB instance (local Compass connection string works)
- SMTP credentials (e.g. Gmail app password) for Nodemailer
- Google OAuth 2.0 Client (if using Google sign-in)

## Environment

Create a `.env` file in `server/` using the template below:

```
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/devopsapp
JWT_SECRET=super-secret-key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000

EMAIL_USER=your-email@example.com
EMAIL_PASS=your-email-password-or-app-password
EMAIL_FROM="DevopsApp <your-email@example.com>"
# Optional overrides:
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_SECURE=false
# SMTP_URL=smtp://user:pass@smtp.gmail.com:587

GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

> Warning: Gmail users must enable 2-Step Verification and create an App Password.

## Install & Run

```bash
cd server
npm install
npm run dev
```

The API boots on `http://localhost:5000` by default. Health check: `GET /health`.

## Auth Flow

- `POST /api/auth/register` – create account, triggers verification email.
- `GET /api/auth/verify-email?token=...` – verify email link.
- `POST /api/auth/resend-verification` – resend verification email.
- `POST /api/auth/login` – sign in with email + password.
- `POST /api/auth/google` – verify Google ID token and issue JWT.
- `GET /api/auth/me` – fetch current user (requires `Authorization: Bearer <token>`).

## Todo Endpoints

All todo routes require a verified account.

- `GET /api/todos` – list current user todos.
- `POST /api/todos` – create todo; sends notification email.
- `GET /api/todos/:id` – fetch single todo.
- `PUT /api/todos/:id` – update todo (status changes trigger email notice).
- `DELETE /api/todos/:id` – remove todo.

## Email Notifications

- Registration: verification link emailed.
- Todo creation: confirmation email.
- Todo status change: notification when status updates (e.g. completed).

## Google Sign-In

Client obtains an ID token via Google Sign-In SDK, then calls `POST /api/auth/google` with `{ "idToken": "..." }`. The backend validates the token, provisions the user if needed, and returns a JWT. No OAuth redirect flow is hosted by this server, so you can integrate it later with your frontend.

## Project Structure

```
server/
├─ index.js              # App entry point and route mounting
├─ controllers/          # Route handlers (auth, todos)
├─ models/               # Mongoose models
├─ routes/               # Express routers
├─ middlewares/          # Auth + error middleware
└─ utils/                # DB, email, async helpers
```

## Next Steps

- Add tests for controller flows.
- Hook up a frontend to consume the API.
- Replace local MongoDB connection with Atlas when ready.
- Configure production-ready SMTP provider if needed.
