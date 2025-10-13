# GitHub Actions CI/CD Setup Guide

## 🎯 Overview

This CI/CD pipeline automatically:
- ✅ Tests backend and frontend code
- 🔒 Scans for security vulnerabilities
- 🐳 Builds Docker images
- 📦 Pushes images to DockerHub
- 🚀 Ready for deployment (we'll add EC2 deployment later)

## 📋 Prerequisites

1. **GitHub Account** with this repository
2. **DockerHub Account** - [Sign up free](https://hub.docker.com/)

## 🔧 Setup Steps

### Step 1: Create DockerHub Account

1. Go to [DockerHub](https://hub.docker.com/)
2. Sign up for free account
3. Note your username (you'll need it)

### Step 2: Add GitHub Secrets

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add these secrets:

| Secret Name | Value | Description |
|------------|-------|-------------|
| `DOCKER_USERNAME` | your-dockerhub-username | Your DockerHub username |
| `DOCKER_PASSWORD` | your-dockerhub-password | Your DockerHub password or access token |

**Recommended:** Use an access token instead of password:
- Go to DockerHub → Account Settings → Security → New Access Token
- Copy the token and use it as `DOCKER_PASSWORD`

### Step 3: Test the Pipeline

1. Make a change to any file (e.g., update README.md)
2. Commit and push to `main` branch:
   ```bash
   git add .
   git commit -m "test: trigger CI/CD pipeline"
   git push origin main
   ```
3. Go to GitHub repository → **Actions** tab
4. Watch the workflow run!

## 📊 What Each Job Does

### 1. **test-backend** 🧪
- Checks out code
- Installs Node.js dependencies
- Runs linter (if configured)
- Runs tests (if configured)

### 2. **test-frontend** 🎨
- Checks out code
- Installs dependencies
- Runs ESLint
- Builds production bundle
- Uploads build artifacts

### 3. **security-scan** 🔒
- Scans for vulnerabilities using Trivy
- Checks for HIGH and CRITICAL issues
- Reports findings (non-blocking)

### 4. **build-and-push** 🐳
- Only runs on `main` branch
- Builds optimized Docker images
- Pushes to DockerHub
- Tags: `latest`, `main-<commit-sha>`
- Uses layer caching for speed

## 🎨 Workflow Visualization

```
┌─────────────────┐
│  Push to main   │
└────────┬────────┘
         │
    ┌────┴────┐
    │ Trigger │
    └────┬────┘
         │
    ┌────┴─────────────────────────┐
    │                              │
┌───▼───────┐  ┌──────────┐  ┌────▼──────┐
│  Backend  │  │ Frontend │  │ Security  │
│   Test    │  │   Test   │  │   Scan    │
└───┬───────┘  └────┬─────┘  └─────┬─────┘
    │               │              │
    └───────┬───────┴──────────────┘
            │
    ┌───────▼────────┐
    │ Build & Push   │
    │ Docker Images  │
    └───────┬────────┘
            │
    ┌───────▼────────┐
    │   DockerHub    │
    │ latest images  │
    └────────────────┘
```

## 🐛 Troubleshooting

### Pipeline fails on "Login to DockerHub"
- ✅ Check `DOCKER_USERNAME` secret is correct
- ✅ Check `DOCKER_PASSWORD` secret is correct
- ✅ Try using access token instead of password

### Backend/Frontend tests fail
- ✅ Tests currently skip if not configured (they won't fail)
- ✅ We'll add tests in future iterations

### Security scan fails
- ✅ Currently set to non-blocking (`exit-code: 0`)
- ✅ Review warnings and update dependencies if needed

### Build fails
- ✅ Check Dockerfile syntax
- ✅ Check all files are committed
- ✅ Review Action logs for specific errors

## 📦 View Your Docker Images

After successful pipeline run:
1. Go to [DockerHub](https://hub.docker.com/)
2. Login to your account
3. You'll see two repositories:
   - `your-username/devopsapp-backend`
   - `your-username/devopsapp-frontend`

## 🔄 Workflow Triggers

The pipeline runs on:
- ✅ **Push to `main`** - Full pipeline + Docker build/push
- ✅ **Push to `develop`** - Tests + security scan only
- ✅ **Pull Request to `main`** - Tests + security scan only

## ⚡ Performance Features

- **Caching**: npm dependencies cached between runs
- **Layer Caching**: Docker layers cached for faster builds
- **Parallel Jobs**: Tests run simultaneously
- **Conditional Execution**: Docker push only on main branch

## 🚀 Next Steps

Once this is working:
1. ✅ Add EC2 deployment job
2. ✅ Add Slack/Email notifications
3. ✅ Add automated tests
4. ✅ Add code coverage reports
5. ✅ Add deployment environments (staging/prod)

## 📝 Files Created

```
.github/
  workflows/
    ci-cd.yml          # Main CI/CD pipeline
docs/
  github-actions.md    # This guide
```

## 🎓 Learning Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Build Push Action](https://github.com/docker/build-push-action)
- [Trivy Security Scanner](https://github.com/aquasecurity/trivy)

---

## ✅ Success Checklist

- [ ] DockerHub account created
- [ ] GitHub secrets added (`DOCKER_USERNAME`, `DOCKER_PASSWORD`)
- [ ] Code pushed to trigger pipeline
- [ ] All jobs passed (green checkmarks)
- [ ] Docker images visible on DockerHub
- [ ] Can pull and run images locally

Test pulling your images:
```bash
docker pull your-username/devopsapp-backend:latest
docker pull your-username/devopsapp-frontend:latest
```

**Ready for Phase 1.2: AWS EC2 Deployment!** 🎉
