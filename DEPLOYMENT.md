# SpeakCEO.ai Deployment Guide 🚀

## Quick Deployment Checklist

### 1. Supabase Configuration
- [ ] **Create Supabase Project**: https://supabase.com/dashboard
- [ ] **Get Database URL and API Key** from Settings → API
- [ ] **Disable Email Confirmation** (Auth → Settings → "Enable email confirmations" = OFF)
- [ ] **Set RLS Policies** (will be done automatically via app)

### 2. Environment Setup
Create `.env` file in project root:
```bash
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 3. One-Click Setup
1. **Start the application**: `npm run dev`
2. **Go to login page**: `http://localhost:5173`
3. **Click "🚀 Full Setup"** button
4. **Wait for completion** (creates tables, accounts, data, policies)

### 4. Test Login
- **Demo Account**: demo@speakceo.ai / Demo123!
- **Admin Account**: admin@speakceo.ai / Admin123!

---

## Production Deployment Options

### Option A: Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Build and deploy
npm run build
vercel --prod

# Set environment variables in Vercel dashboard
```

### Option B: Netlify
```bash
# Build project
npm run build

# Deploy to Netlify
# Upload dist/ folder or connect Git repository
```

### Option C: Traditional Hosting
```bash
# Build for production
npm run build

# Upload dist/ folder to your web server
# Configure environment variables on your hosting platform
```

---

## Database Schema

The application automatically creates these tables:

### Core Tables
- **profiles** - User profiles and roles
- **courses** - Course content and metadata
- **tasks** - Learning tasks and assignments
- **user_progress** - Student progress tracking
- **lessons** - Individual lesson content
- **achievements** - Gamification achievements
- **notifications** - System notifications

### Admin Tables
- **admin_settings** - Application configuration
- **analytics** - Usage analytics
- **reports** - Generated reports

---

## Security Configuration

### Row Level Security (RLS) Policies
- ✅ **Profiles**: Users can view all, edit own
- ✅ **Courses**: Everyone can view, admins can modify
- ✅ **Tasks**: Everyone can view, admins can modify
- ✅ **Progress**: Users see own, admins see all

### Admin Access
- Admin users have full CRUD access to all tables
- Demo users have read-only access with progress tracking
- Authentication required for all dashboard features

---

## Troubleshooting

### Common Issues

#### 1. "Account creation failed"
**Solution**: Disable email confirmation in Supabase
- Go to Supabase → Authentication → Settings
- Turn OFF "Enable email confirmations"

#### 2. "Table does not exist"
**Solution**: Run full setup
- Click "🚀 Full Setup" button in login page
- Or manually run: `await createAllTables()` in console

#### 3. "Permission denied"
**Solution**: Check RLS policies
- Run full setup to create proper policies
- Or manually configure in Supabase → Authentication → Policies

#### 4. Environment variables not working
**Solution**: Check .env file
- File must be in project root
- Variables must start with `VITE_`
- Restart development server after changes

### Production Environment Variables
```bash
# Required for production
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Optional
NODE_ENV=production
```

---

## Performance Optimization

### For Production
1. **Build optimization** is already configured in Vite
2. **Code splitting** is automatic for large components
3. **Image optimization** uses Unsplash CDN
4. **Database indexing** is handled by Supabase

### Monitoring
- Use Supabase dashboard for database metrics
- Monitor authentication usage in Supabase Auth
- Check API usage in Supabase Settings → Usage

---

## Support

### Demo Credentials
- **Student Demo**: demo@speakceo.ai / Demo123!
- **Admin Demo**: admin@speakceo.ai / Admin123!

### Database URL
- **Hosted Instance**: https://xgvtduyizhaiqguuskfu.supabase.co

### Auto-Setup Features
- ✅ Database tables creation
- ✅ Sample course content
- ✅ Demo user accounts
- ✅ Admin user accounts
- ✅ Security policies
- ✅ Progress tracking setup

---

## Ready to Deploy! 🎉

Once you've completed the checklist above, your SpeakCEO.ai application will be ready for production use with:

- 📚 Complete course management system
- 👥 User authentication and profiles
- 📊 Progress tracking and analytics
- 🎮 Gamification features
- 👨‍💼 Admin dashboard
- 🔒 Security policies
- 📱 Responsive design

**Next Steps**: Test all functionality with demo accounts, then invite real users! 