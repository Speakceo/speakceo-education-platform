#!/bin/bash

echo "🚀 SpeakCEO Platform Deployment Setup"
echo "======================================"
echo ""

# Test build locally first
echo "🔨 Testing build process..."
npm install
npx tsc && npx vite build

if [ $? -eq 0 ]; then
    echo "✅ Build successful! Ready for deployment."
else
    echo "❌ Build failed. Please fix build errors before deploying."
    exit 1
fi

echo ""
echo "📝 Step 1: Create GitHub Repository"
echo "1. Go to https://github.com/new"
echo "2. Repository name: speakceo-education-platform"  
echo "3. Description: SpeakCEO - 90-Day Young CEO Program Education Platform"
echo "4. Keep it Public (or Private if you prefer)"
echo "5. DO NOT initialize with README, .gitignore, or license"
echo "6. Click 'Create repository'"
echo ""

echo "📝 Step 2: Connect to GitHub (replace YOUR_USERNAME)"
echo "git remote add origin https://github.com/YOUR_USERNAME/speakceo-education-platform.git"
echo "git branch -M main"  
echo "git push -u origin main"
echo ""

echo "🌐 Step 3: Deploy to Netlify"
echo "1. Go to https://app.netlify.com/start"
echo "2. Click 'Import from Git'"
echo "3. Choose GitHub and authorize Netlify"
echo "4. Select your repository: speakceo-education-platform"
echo "5. Configure build settings:"
echo "   - Build command: npm install && npx tsc && npx vite build"
echo "   - Publish directory: dist"
echo "   - Node version: 18"
echo "6. Add environment variables in Netlify dashboard:"
echo "   - VITE_SUPABASE_URL: https://xgvtduyizhaiqguuskfu.supabase.co"
echo "   - VITE_SUPABASE_ANON_KEY: [your supabase anon key from dashboard]"
echo "7. Click 'Deploy site'"
echo ""

echo "🔑 Step 4: Get Supabase Keys"
echo "1. Go to https://supabase.com/dashboard/project/xgvtduyizhaiqguuskfu"
echo "2. Go to Settings > API"
echo "3. Copy the 'anon' 'public' key"
echo "4. Add it to Netlify environment variables"
echo ""

echo "✨ After deployment:"
echo "- Any git push to main branch will auto-deploy"
echo "- You can edit code in Cursor and push updates"
echo "- Netlify will rebuild and deploy automatically"
echo "- Site will be available at: https://[random-name].netlify.app"
echo ""

echo "🎯 Quick Commands for Future Updates:"
echo "git add ."
echo "git commit -m 'Update: description of changes'"
echo "git push"

