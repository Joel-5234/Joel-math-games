# Deployment Guide

## GitHub Pages Deployment

This project uses GitHub Actions to automatically deploy to GitHub Pages when changes are pushed to the `main` branch.

## Setup Instructions

### 1. Enable GitHub Pages

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions** (not "Deploy from a branch")
4. Save the settings

### 2. GitHub Token (Optional - Not Required)

The workflow uses GitHub's built-in `GITHUB_TOKEN` which is automatically provided. No additional token setup is required for standard GitHub Pages deployment.

If you need a custom token for any reason:
1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Name: `GH_TOKEN` (or as configured in workflow)
4. Value: Your GitHub Personal Access Token with `repo` and `pages` permissions
5. Click **Add secret**

### 3. Deployment Process

The deployment happens automatically:

1. **Push to main branch**: When you push code to the `main` branch, the workflow triggers
2. **Build**: The workflow runs `./scripts/build` to prepare files in `dist/`
3. **Deploy**: Files from `dist/` are deployed to GitHub Pages
4. **Access**: Your site will be available at:
   - `https://[username].github.io/[repository-name]/`
   - Or custom domain if configured

### 4. Manual Deployment

You can also trigger deployment manually:

1. Go to **Actions** tab in your repository
2. Select **Deploy to GitHub Pages** workflow
3. Click **Run workflow**
4. Select branch (usually `main`)
5. Click **Run workflow**

### 5. Verify Deployment

After deployment:

1. Check the **Actions** tab to see if the workflow completed successfully
2. Visit your GitHub Pages URL
3. Test all functionality:
   - All four problem types work
   - Timer functions correctly
   - Achievements unlock
   - localStorage persists

## Troubleshooting

### Workflow Fails

- Check the **Actions** tab for error messages
- Verify `scripts/build` has execute permissions
- Ensure all required files exist (index.html, styles.css, app.js, config.json)

### Site Not Updating

- GitHub Pages can take a few minutes to update
- Clear browser cache
- Check if workflow completed successfully in Actions tab

### 404 Error

- Verify GitHub Pages is enabled in repository settings
- Check that the source is set to "GitHub Actions"
- Ensure the workflow completed successfully

## Build Process

The build script (`./scripts/build`) copies the following files to `dist/`:
- `index.html`
- `styles.css`
- `app.js`
- `config.json`

These files are then deployed to GitHub Pages.

## Custom Domain (Optional)

To use a custom domain:

1. Add a `CNAME` file to the `dist/` directory with your domain
2. Update the build script to include `CNAME` in the dist folder
3. Configure DNS settings with your domain provider
4. Add the custom domain in GitHub Pages settings

