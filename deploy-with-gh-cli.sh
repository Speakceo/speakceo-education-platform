#!/bin/bash

echo "🚀 SpeakCEO Platform - GitHub CLI Deployment"
echo "============================================="
echo ""

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI not found. Installing..."
    brew install gh
    echo "✅ GitHub CLI installed!"
fi

# Check if authenticated
if ! gh auth status &> /dev/null; then
    echo "🔐 Please authenticate with GitHub..."
    gh auth login
fi

echo "📊 Repository Status:"
echo "Repository: https://github.com/Speakceo/speakceo-education-platform"
echo "✅ Code successfully pushed to GitHub!"
echo ""

# Test build
echo "🔨 Testing build process..."
npm install > /dev/null 2>&1
if npx tsc && npx vite build > /dev/null 2>&1; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed. Please check for errors."
    exit 1
fi

echo ""
echo "🌐 Now let's deploy to Netlify!"
echo ""

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "🔧 Installing Netlify CLI..."
    npm install -g netlify-cli
    echo "✅ Netlify CLI installed!"
fi

echo "🎯 Choose your deployment method:"
echo "1. 🚀 Automatic deployment (recommended)"
echo "2. 📱 Manual setup via web interface"
echo ""

read -p "Enter your choice (1 or 2): " choice

if [ "$choice" = "1" ]; then
    echo ""
    echo "🚀 Setting up automatic deployment..."
    echo "This will:"
    echo "- Connect your GitHub repo to Netlify"
    echo "- Configure build settings automatically"
    echo "- Deploy your site"
    echo ""
    
    # Login to Netlify
    echo "🔐 Please login to Netlify..."
    netlify login
    
    echo ""
    echo "🏗️ Creating Netlify site..."
    
    # Create site and link to repo
    netlify sites:create --name speakceo-education-platform
    
    echo ""
    echo "🔗 Linking repository..."
    netlify link
    
    echo ""
    echo "⚙️ Setting build configuration..."
    netlify env:set VITE_SUPABASE_URL "https://xgvtduyizhaiqguuskfu.supabase.co"
    
    echo "🔑 Please enter your Supabase ANON key:"
    echo "Get it from: https://supabase.com/dashboard/project/xgvtduyizhaiqguuskfu/settings/api"
    read -s -p "VITE_SUPABASE_ANON_KEY: " supabase_key
    echo ""
    
    netlify env:set VITE_SUPABASE_ANON_KEY "$supabase_key"
    
    echo ""
    echo "🚀 Deploying site..."
    netlify deploy --prod --dir=dist
    
    echo ""
    echo "✨ Getting site URL..."
    site_url=$(netlify status --json | jq -r '.site.url')
    echo "🎉 Your site is live at: $site_url"
    
else
    echo ""
    echo "📱 Manual Setup Instructions:"
    echo "=============================="
    echo ""
    echo "1. Go to: https://app.netlify.com/start"
    echo "2. Click 'Import from Git'"
    echo "3. Choose GitHub and authorize"
    echo "4. Select: Speakceo/speakceo-education-platform"
    echo "5. Configure build settings:"
    echo "   - Build command: npm install && npx tsc && npx vite build"
    echo "   - Publish directory: dist"
    echo "   - Node version: 18"
    echo ""
    echo "6. Add environment variables:"
    echo "   - VITE_SUPABASE_URL: https://xgvtduyizhaiqguuskfu.supabase.co"
    echo "   - VITE_SUPABASE_ANON_KEY: [Get from Supabase dashboard]"
    echo ""
    echo "🔑 Get Supabase key from:"
    echo "https://supabase.com/dashboard/project/xgvtduyizhaiqguuskfu/settings/api"
    echo ""
    echo "7. Click 'Deploy site'"
fi

echo ""
echo "🔄 Continuous Deployment Setup Complete!"
echo "========================================="
echo ""
echo "Future updates are now automated:"
echo "1. Edit code in Cursor"
echo "2. Save changes"
echo "3. Run: git add . && git commit -m 'Your update' && git push"
echo "4. Netlify automatically rebuilds and deploys!"
echo ""

echo "🛠️ Useful commands:"
echo "- View deployments: netlify open"
echo "- Check status: netlify status"
echo "- View logs: netlify logs"
echo "- Local preview: netlify dev"
echo ""

echo "�� Repository: https://github.com/Speakceo/speakceo-education-platform"
echo "📚 Full docs: ./DEPLOYMENT_GUIDE.md"
