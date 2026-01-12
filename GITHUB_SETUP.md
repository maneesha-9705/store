# GitHub Setup Guide for Fancy Store

## Prerequisites
1. Create a GitHub account at https://github.com if you don't have one
2. Install Git on your computer (already done ✓)

## Step-by-Step Guide to Push Your Project

### 1. Create a New Repository on GitHub
1. Go to https://github.com/new
2. Repository name: `store` (or any name you prefer)
3. Description: "E-commerce store for fancy items with admin dashboard"
4. Choose **Public**
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

### 2. Configure Git (First Time Only)
Open PowerShell in your project folder and run:
```powershell
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"
```

### 3. Add All Files to Git
```powershell
git add .
```

### 4. Commit Your Files
```powershell
git commit -m "Initial commit: Fancy store with admin dashboard and Razorpay integration"
```

### 5. Connect to GitHub Repository
Replace `YOUR_USERNAME` with your GitHub username:
```powershell
git remote add origin https://github.com/YOUR_USERNAME/fancy-store.git
```

### 6. Push to GitHub
```powershell
git branch -M main
git push -u origin main
```

## Important Notes

### Environment Variables (.env)
Your `.env` file is **NOT** pushed to GitHub (it's in `.gitignore`). This is important for security!

You should create a `.env.example` file to show what environment variables are needed:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### Files NOT Pushed to GitHub
The following are automatically excluded (see `.gitignore`):
- `node_modules/` - Dependencies (too large, can be reinstalled)
- `.env` - Sensitive credentials
- Build outputs and logs
- IDE configuration files

## Future Updates

After making changes to your code:
```powershell
# Check what files changed
git status

# Add all changed files
git add .

# Commit with a descriptive message
git commit -m "Description of what you changed"

# Push to GitHub
git push
```

## Common Git Commands

| Command | Description |
|---------|-------------|
| `git status` | See what files have changed |
| `git add .` | Stage all changes |
| `git add <file>` | Stage specific file |
| `git commit -m "message"` | Commit staged changes |
| `git push` | Push commits to GitHub |
| `git pull` | Pull latest changes from GitHub |
| `git log` | View commit history |

## Troubleshooting

### If you get authentication errors:
GitHub no longer accepts passwords. You need to use a Personal Access Token:
1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token with `repo` scope
3. Use this token as your password when pushing

### If remote already exists:
```powershell
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/fancy-store.git
```

## Need Help?
- GitHub Docs: https://docs.github.com
- Git Basics: https://git-scm.com/book/en/v2/Getting-Started-Git-Basics
