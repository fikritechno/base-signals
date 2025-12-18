# GitHub Repository Setup

The repository has been initialized locally. To push to GitHub:

## Step 1: Create Repository on GitHub

1. Go to https://github.com/new
2. Repository name: `basesignals`
3. Description: "On-chain behavioral signals & intent graph for Base users"
4. Visibility: **Public**
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

## Step 2: Push to GitHub

After creating the repository, run:

```bash
cd /Users/nikolajburlakov/Work/Base/base-signals

# Set remote with token (one-time)
# Replace YOUR_TOKEN with your actual GitHub Personal Access Token
git remote set-url origin https://YOUR_TOKEN@github.com/fikritechno/basesignals.git

# Push
git push -u origin main

# Remove token from URL for security
git remote set-url origin https://github.com/fikritechno/basesignals.git
```

## Alternative: Using GitHub CLI

If you have GitHub CLI installed:

```bash
gh auth login
gh repo create fikritechno/basesignals --public --source=. --remote=origin --push
```

## Credentials Used

- Username: `fikritechno`
- Email: `ajokapim774@gmail.com`
- Token: `YOUR_TOKEN` (store securely, do not commit to git)

**Note:** The git config is already set for this repository. Never commit tokens to git!

