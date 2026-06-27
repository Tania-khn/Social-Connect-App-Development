# 🐙 How to Upload Social Connect to GitHub

Step-by-step guide to push this project to a new GitHub repository.

---

## 📋 Prerequisites

1. **Git installed** — Download from [git-scm.com](https://git-scm.com/downloads)
   ```bash
   git --version    # should print git version 2.x
   ```

2. **GitHub account** — Create one at [github.com](https://github.com) if you don't have one

3. **GitHub authentication set up** — Either:
   - **HTTPS**: Use a Personal Access Token (passwords no longer work)
   - **SSH**: Set up SSH keys ([GitHub SSH guide](https://docs.github.com/en/authentication/connecting-to-github-with-ssh))

---

## 🚀 Step 1: Create a New GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Fill in:
   - **Repository name**: `social-connect` (or your preferred name)
   - **Description**: `A modern social connect app built with React Native CLI, Firebase, and Context API`
   - **Visibility**: Choose **Public** or **Private**
   - **DO NOT** check "Add a README file" (we already have one)
   - **DO NOT** add `.gitignore` or license (we already have both)
3. Click **Create repository**

GitHub will show you a page with commands like:
```
git remote add origin https://github.com/YOUR_USERNAME/social-connect.git
git branch -M main
git push -u origin main
```

**Copy your repository URL** — you'll need it below.

---

## 📁 Step 2: Initialize Git in Your Project

Open a terminal in the `SocialConnect` project folder:

```bash
cd SocialConnect
```

If this is your first time using Git on this computer, set your name and email:
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

Initialize a new Git repository:
```bash
git init
git branch -M main
```

---

## ✅ Step 3: Verify .gitignore is Working

The project already has a `.gitignore` that excludes:
- `node_modules/` (huge, should never be committed)
- `android/.gradle/`, `android/build/`, `android/app/build/`
- `ios/Pods/`, `ios/build/`
- `.env`, `google-services.json`, `GoogleService-Info.plist` (secrets!)
- IDE folders (`.idea/`, `.vscode/`)

Verify it's working:
```bash
git status
```

You should see source files only, NOT `node_modules/` or build folders. If you see those, the `.gitignore` needs fixing.

---

## 📦 Step 4: Stage and Commit Your Code

Add all files:
```bash
git add .
```

Verify what will be committed:
```bash
git status
```

Create your first commit:
```bash
git commit -m "Initial commit: Social Connect app

- React Native 0.74 CLI project
- Firebase Auth + Firestore + Storage + Messaging
- Context API state management (Auth, Posts, Theme)
- Screens: Landing, Login, SignUp, ForgotPassword, Feed,
  CreatePost, Comments, Profile, ProfileEdit, Settings,
  ChangePassword, NotificationSettings, PrivacyPolicy,
  HelpSupport, EmailInfo, Search, DiscoverPeople, UserProfile,
  Notifications
- Real-time likes/comments via Firestore onSnapshot
- Push notifications via FCM + Notifee
- Reanimated animations
- ESLint + Prettier configured
- Cloud Functions example for notification triggers"
```

---

## 🔗 Step 5: Connect to GitHub and Push

Add your GitHub repository as a remote (replace `YOUR_USERNAME`):
```bash
git remote add origin https://github.com/YOUR_USERNAME/social-connect.git
```

Push your code:
```bash
git push -u origin main
```

If using SSH:
```bash
git remote add origin git@github.com:YOUR_USERNAME/social-connect.git
git push -u origin main
```

> **First push may ask for credentials:**
> - HTTPS: Enter your GitHub username + Personal Access Token (NOT your password)
> - SSH: Should work automatically if keys are set up

---

## ✅ Step 6: Verify on GitHub

1. Refresh your repository page on GitHub
2. You should see all your files and folders
3. The README.md should render automatically on the home page

---

## 🔄 Daily Workflow (After First Upload)

When you make changes, push them with:

```bash
# Stage changes
git add .

# Commit with a message
git commit -m "feat: added video posts and notification bell"

# Push to GitHub
git push
```

### Commit Message Convention (Recommended)

Use these prefixes for clarity:
- `feat:` — new feature (e.g., `feat: added Discover People screen`)
- `fix:` — bug fix (e.g., `fix: video not playing on Android`)
- `docs:` — documentation (e.g., `docs: updated README`)
- `style:` — formatting/styling (e.g., `style: adjusted spacing on PostCard`)
- `refactor:` — code restructuring (e.g., `refactor: moved validation to utils/`)
- `chore:` — maintenance (e.g., `chore: updated dependencies`)

---

## 🌿 Working with Branches (Best Practice)

Don't push directly to `main` for big changes. Use branches:

```bash
# Create and switch to a new branch
git checkout -b feature/dark-mode

# Make changes, commit them
git add .
git commit -m "feat: added dark mode toggle"

# Push the branch
git push -u origin feature/dark-mode

# On GitHub: open a Pull Request to merge into main
```

---

## ⚠️ Important: Never Commit These

The `.gitignore` already excludes these, but double-check:

| File | Why |
|------|-----|
| `google-services.json` | Contains Firebase API keys — anyone with this can access your backend |
| `GoogleService-Info.plist` | iOS Firebase config — same as above |
| `.env` | Environment variables with secrets |
| `node_modules/` | Huge (100MB+), can be reinstalled via `npm install` |
| `android/app/build/` | Build artifacts |
| `ios/Pods/` | CocoaPods dependencies (reinstall via `pod install`) |

If you accidentally commit a secret:
```bash
# Remove from Git history (use carefully!)
git rm --cached google-services.json
echo "google-services.json" >> .gitignore
git commit -m "chore: removed accidentally committed secrets"
git push
```

> ⚠️ **If you committed a real Firebase key, regenerate it in Firebase Console** — assume it's compromised.

---

## 📊 Repository Structure (What GitHub Will Show)

```
social-connect/
├── src/                    # 50 JS files — main app code
│   ├── api/                # Firebase wrappers
│   ├── components/         # Reusable UI components
│   ├── contexts/           # React Context providers
│   ├── navigation/         # React Navigation setup
│   ├── screens/            # All app screens
│   ├── theme/              # Colors, typography, spacing
│   └── utils/              # Validation, time, image picker
├── functions/              # Firebase Cloud Functions
├── __tests__/              # Jest test files
├── android/                # Android native project (generated)
├── ios/                    # iOS native project (generated)
├── package.json
├── README.md
├── RUN_ON_ANDROID.md
├── GITHUB_UPLOAD.md
├── .eslintrc.js
├── .prettierrc.js
├── .gitignore
├── babel.config.js
├── metro.config.js
└── index.js
```

---

## 🎯 Quick One-Liner (If You Already Know Git)

```bash
cd SocialConnect
git init && git branch -M main
git add .
git commit -m "Initial commit: Social Connect app"
git remote add origin https://github.com/YOUR_USERNAME/social-connect.git
git push -u origin main
```

---

## ❓ Troubleshooting

### "Permission denied (publickey)" (SSH)
SSH keys not set up. Either:
- Set up SSH: `ssh-keygen -t ed25519 -C "your.email@example.com"` → add to GitHub
- Or switch to HTTPS: `git remote set-url origin https://github.com/YOUR_USERNAME/social-connect.git`

### "fatal: remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/social-connect.git
```

### "Updates were rejected because the remote contains work"
```bash
git pull origin main --allow-unrelated-histories
git push -u origin main
```

### Large file errors (file > 100MB)
Check what's too big:
```bash
git rev-list --objects --all | git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' | awk '/^blob/ {if ($3 > 100000000) print $4, $3}'
```
Then add to `.gitignore` and remove from history.

---

## 🎉 Done!

Your repository is now live on GitHub. Share the URL with your team, instructors, or anyone who wants to try the app!

To clone it on another computer:
```bash
git clone https://github.com/YOUR_USERNAME/social-connect.git
cd social-connect
npm install
# Follow RUN_ON_ANDROID.md to run it
```
