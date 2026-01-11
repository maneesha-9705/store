# 🚀 Quick GitHub Push Commands

## First Time Setup (Do this once)

### 1. Configure Git (if not done already)
```powershell
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"
```

### 2. Create GitHub Repository
1. Go to: https://github.com/new
2. Repository name: `fancy-store`
3. Make it Public or Private
4. **DO NOT** check any boxes (no README, no .gitignore, no license)
5. Click "Create repository"

### 3. Push Your Code (Copy & Paste These Commands)

```powershell
# Add all files
git add .

# Commit with a message
git commit -m "Initial commit: Fancy store with admin dashboard and Razorpay integration"

# Connect to your GitHub repo (REPLACE YOUR_USERNAME with your actual GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/fancy-store.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Important**: Replace `YOUR_USERNAME` in the command above with your actual GitHub username!

---

## For Future Updates (After First Push)

Every time you make changes and want to update GitHub:

```powershell
# See what changed
git status

# Add all changes
git add .

# Commit with a descriptive message
git commit -m "Describe what you changed"

# Push to GitHub
git push
```

---

## Common Issues & Solutions

### ❌ Authentication Failed
GitHub doesn't accept passwords anymore. You need a Personal Access Token:

1. Go to: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Give it a name: "Fancy Store"
4. Check the `repo` scope
5. Click "Generate token"
6. **Copy the token** (you won't see it again!)
7. When pushing, use this token as your password

### ❌ Remote Already Exists
```powershell
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/fancy-store.git
```

### ❌ Files Too Large
The `.gitignore` file already excludes large files like `node_modules/`

---

## What Gets Pushed? ✅

✅ Source code (`.js`, `.jsx`, `.html`, `.css`)
✅ Configuration files (`package.json`, `vite.config.js`)
✅ README and documentation
✅ `.gitignore` and `.env.example`

## What Doesn't Get Pushed? ❌

❌ `node_modules/` (too large, can be reinstalled)
❌ `.env` (contains secrets!)
❌ Build outputs (`dist/`, `build/`)
❌ Log files

---

## Need More Help?

📖 Read the detailed guide: `GITHUB_SETUP.md`
🌐 GitHub Docs: https://docs.github.com
