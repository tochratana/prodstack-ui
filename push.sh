#!/bin/bash

# Auto push to git remote: prodstack
# Usage: bash push.sh "your commit message"

REMOTE="prodstack"
BRANCH="main"

# Use custom commit message or default
COMMIT_MSG="${1:-"chore: auto push $(date '+%Y-%m-%d %H:%M:%S')"}"

echo "📦 Staging all changes..."
git add .

echo "✍️  Committing: $COMMIT_MSG"
git commit -m "$COMMIT_MSG"

echo "🚀 Pushing to $REMOTE/$BRANCH..."
git push $REMOTE $BRANCH

echo "✅ Done!"
