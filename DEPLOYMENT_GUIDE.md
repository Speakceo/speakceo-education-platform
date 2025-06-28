# SpeakCEO Platform - Deployment Guide

## 🚀 Quick Deployment to Netlify

### Prerequisites
- GitHub account
- Netlify account
- Supabase project (already configured)

### Step 1: GitHub Repository Setup

1. Go to [GitHub.com](https://github.com/new)
2. Create new repository:
   - Name: `speakceo-education-platform`
   - Description: `SpeakCEO - 90-Day Young CEO Program Education Platform`
   - Public/Private (your choice)
   - **DO NOT** initialize with README/gitignore
3. Copy the repository URL

### Step 2: Connect Local Code to GitHub

Replace `YOUR_USERNAME` with your GitHub username:

```bash
git remote add origin https://github.com/YOUR_USERNAME/speakceo-education-platform.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy to Netlify

1. Go to [Netlify](https://app.netlify.com/start)
2. Click **"Import from Git"**
3. Choose **GitHub** and authorize Netlify
4. Select your repository: `speakceo-education-platform`
5. Configure build settings:
   - **Build command**: `npm install && npx tsc && npx vite build`
   - **Publish directory**: `dist`
   - **Node version**: `18`

### Step 4: Environment Variables

In Netlify dashboard, go to **Site settings > Environment variables** and add:

```
VITE_SUPABASE_URL=https://xgvtduyizhaiqguuskfu.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

To get the Supabase key:
1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/xgvtduyizhaiqguuskfu)
2. Settings > API
3. Copy the **"anon" "public"** key

### Step 5: Deploy!

Click **"Deploy site"** in Netlify.

## 🔄 Continuous Deployment

After initial setup, any changes you push to the main branch will automatically deploy:

```bash
# Make your changes in Cursor
git add .
git commit -m "Update: description of changes"
git push
```

Netlify will:
1. Detect the push
2. Run the build command
3. Deploy the new version
4. Update your live site

## 📱 Your Live Site

After deployment, your site will be available at:
- Initial URL: `https://[random-name].netlify.app`
- You can customize the domain in Netlify settings

## 🛠️ Local Development

```bash
npm install
npm run dev
```

Runs on `http://localhost:5173`

## 🏗️ Manual Build Test

```bash
npm run build
npm run preview
```

## 🔍 Troubleshooting

### Build Fails
- Check environment variables are set correctly
- Ensure Supabase keys are valid
- Check for TypeScript errors: `npx tsc --noEmit`

### Site Loads but Auth Doesn't Work
- Verify environment variables in Netlify
- Check Supabase URL and keys
- Ensure Supabase email confirmation is configured

### Updates Don't Deploy
- Check if git push succeeded
- Check Netlify deploy logs
- Verify build command is correct

## 📊 Current Configuration

- **Framework**: React 18 + TypeScript + Vite
- **Database**: Supabase
- **Styling**: Tailwind CSS
- **Authentication**: Supabase Auth
- **Deployment**: Netlify with continuous deployment
- **Domain**: TBD (configurable in Netlify)

