# Setup versione
VERSION=$(npm version patch --no-git-tag-version)

# Build
npm run build

# Commit e tag personalizzati
git add .
git commit -m "release: $VERSION"
git tag "$VERSION"

# Push
git push
git push --tags
