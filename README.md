# DevOps Todo Application

Full-stack todo application with authentication, email verification, and Docker deployment.

## Features

- 🔐 **Authentication**: Email/password with JWT tokens
- ✉️ **Email Verification**: Nodemailer integration with verification links
- 🔑 **Google OAuth**: Sign in with Google (ready for integration)
- ✅ **CRUD Operations**: Create, read, update, delete todos
- 📧 **Email Notifications**: Automated emails on todo creation and status changes
- 🐳 **Docker Support**: Full containerization with Docker Compose
- 🎨 **Modern UI**: React + Tailwind CSS responsive design

## Tech Stack

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT authentication
- Nodemailer for emails
- Google OAuth 2.0

### Frontend
- React 19
- React Router
- Tailwind CSS
- Vite

### DevOps
- Docker & Docker Compose
- MongoDB container
- Nginx for frontend serving

## Quick Start with Docker

### Prerequisites
- Docker Desktop installed
- Docker Compose installed

### Setup

1. **Clone and configure**
   ```bash
   cd DevopsApp
   cp .env.example .env
   ```

2. **Edit `.env` file** with your credentials:
   ```bash
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   JWT_SECRET=your-secret-key
   ```

3. **Build and run**
   ```bash
   docker-compose up --build
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - MongoDB: mongodb://admin:admin123@localhost:27017

### Stop the application
```bash
docker-compose down
```

### Stop and remove volumes (clears database)
```bash
docker-compose down -v
```

## Local Development (without Docker)

### Backend Setup
```bash
cd server
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and credentials
npm run dev
```

### Frontend Setup
```bash
cd client
npm install
cp .env.example .env
# Edit .env with API URL
npm run dev
```

### MongoDB
- Option 1: Use MongoDB Compass (local)
- Option 2: Use MongoDB Atlas (cloud)
- Option 3: Use Docker container

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `GET /api/auth/verify-email?token=...` - Verify email
- `POST /api/auth/resend-verification` - Resend verification email
- `POST /api/auth/login` - Login
- `POST /api/auth/google` - Google OAuth
- `GET /api/auth/me` - Get current user (protected)

### Todos
- `GET /api/todos` - List todos (protected)
- `POST /api/todos` - Create todo (protected)
- `GET /api/todos/:id` - Get single todo (protected)
- `PUT /api/todos/:id` - Update todo (protected)
- `DELETE /api/todos/:id` - Delete todo (protected)

## Environment Variables

### Root `.env` (for Docker Compose)
```env
JWT_SECRET=your-secret
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=DevopsApp <your-email@gmail.com>
GOOGLE_CLIENT_ID=your-google-client-id
CLIENT_URL=http://localhost:3000
```

### Server `.env`
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/devopsapp
JWT_SECRET=your-secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=DevopsApp <your-email@gmail.com>
GOOGLE_CLIENT_ID=your-google-client-id
```

### Client `.env`
```env
VITE_API_URL=http://localhost:5000/api
```

## Gmail Setup for Email

1. Enable 2-Step Verification in your Google Account
2. Generate an App Password:
   - Visit https://myaccount.google.com/security
   - Go to "App Passwords"
   - Create password for "Mail" app
3. Use the 16-character password in `EMAIL_PASS`

## Project Structure

```
DevopsApp/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # Auth context
│   │   ├── hooks/         # Custom hooks
│   │   ├── pages/         # Route pages
│   │   └── services/      # API services
│   ├── Dockerfile
│   └── nginx.conf
├── server/                # Express backend
│   ├── controllers/       # Route handlers
│   ├── middlewares/       # Auth & error handling
│   ├── models/            # Mongoose schemas
│   ├── routes/            # API routes
│   ├── utils/             # Helpers
│   └── Dockerfile
├── docker-compose.yml     # Docker orchestration
└── README.md
```

## Docker Services

### MongoDB
- Image: `mongo:7.0`
- Port: `27017`
- Credentials: `admin:admin123`
- Volumes: Persistent data storage

### Backend Server
- Built from `./server/Dockerfile`
- Port: `5000`
- Health check on `/health`

### Frontend Client
- Built from `./client/Dockerfile`
- Port: `3000` (nginx on port 80)
- Served via Nginx

## Troubleshooting

### CORS Issues
- Ensure `CLIENT_URL` matches your frontend URL
- Check allowed origins in `server/index.js`

### Email Not Sending
- Verify Gmail App Password is correct
- Check SMTP settings in `.env`
- Review server logs for errors

### MongoDB Connection Failed
- Ensure MongoDB container is running: `docker-compose ps`
- Check connection string format
- Verify credentials

### Container Won't Start
```bash
# View logs
docker-compose logs server
docker-compose logs client
docker-compose logs mongodb

# Restart specific service
docker-compose restart server
```

## Production Deployment

1. Update `JWT_SECRET` to a strong random string
2. Use MongoDB Atlas instead of local MongoDB
3. Configure production email service (SendGrid, Mailgun, etc.)
4. Set `CLIENT_URL` to your production domain
5. Enable HTTPS/SSL certificates
6. Update CORS allowed origins
7. Review and harden security settings

## License

ISC

## Author

DevOps Team
