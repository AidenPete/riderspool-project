# Riderspool Deployment Guide

This guide will help you deploy your Riderspool application with the backend on Render and frontend on Vercel.

## Prerequisites

- GitHub account
- Render account (https://render.com)
- Vercel account (https://vercel.com)
- Git installed locally

## Part 1: Deploy Backend to Render

### Step 1: Push Code to GitHub

```bash
cd /Users/aidenpete/Desktop/riderspool-project
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### Step 2: Create PostgreSQL Database on Render

1. Go to https://dashboard.render.com
2. Click "New +" → "PostgreSQL"
3. Configure:
   - Name: `riderspool-db`
   - Database: `riderspool`
   - User: (auto-generated)
   - Region: Choose closest to your users
   - Instance Type: Free (for testing) or Starter
4. Click "Create Database"
5. **Copy the Internal Database URL** - you'll need this

### Step 3: Deploy Django Backend

1. On Render Dashboard, click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: `riderspool-backend`
   - **Region**: Same as database
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: Python 3
   - **Build Command**: `./build.sh`
   - **Start Command**: `gunicorn riderspool_backend.wsgi:application`
   - **Instance Type**: Free (for testing) or Starter

4. Add Environment Variables (click "Advanced" → "Add Environment Variable"):
   ```
   SECRET_KEY=<generate-a-secure-random-string>
   DEBUG=False
   ALLOWED_HOSTS=riderspool-backend.onrender.com
   DATABASE_URL=<paste-internal-database-url-from-step-2>
   FRONTEND_URL=<will-add-after-vercel-deployment>
   CORS_ALLOWED_ORIGINS=<will-add-after-vercel-deployment>
   
   # Optional: Email settings
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USE_TLS=True
   EMAIL_HOST_USER=your-email@gmail.com
   EMAIL_HOST_PASSWORD=your-app-password
   DEFAULT_FROM_EMAIL=Riderspool <noreply@riderspool.com>
   ```

5. Click "Create Web Service"
6. Wait for deployment to complete (5-10 minutes)
7. **Copy your backend URL**: `https://riderspool-backend.onrender.com`

### Step 4: Verify Backend Deployment

Visit: `https://riderspool-backend.onrender.com/admin/`
- You should see the Django admin login page

## Part 2: Deploy Frontend to Vercel

### Step 1: Deploy to Vercel

1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)

5. Add Environment Variables:
   ```
   VITE_API_URL=https://riderspool-backend.onrender.com/api/
   ```

6. Click "Deploy"
7. Wait for deployment (2-3 minutes)
8. **Copy your frontend URL**: `https://your-app.vercel.app`

### Step 2: Update Backend Environment Variables

1. Go back to Render Dashboard
2. Open your `riderspool-backend` service
3. Go to "Environment" tab
4. Update these variables:
   ```
   FRONTEND_URL=https://your-app.vercel.app
   CORS_ALLOWED_ORIGINS=https://your-app.vercel.app
   ALLOWED_HOSTS=riderspool-backend.onrender.com,your-app.vercel.app
   ```

5. Click "Save Changes"
6. Service will auto-redeploy

## Part 3: Create Admin Account

1. In Render Dashboard, go to your backend service
2. Click "Shell" tab (or use Render's SSH)
3. Run:
   ```bash
   python manage.py createsuperuser
   ```
4. Follow prompts to create admin account

## Part 4: Test Your Deployment

### Test Backend
- Visit: `https://riderspool-backend.onrender.com/admin/`
- Login with superuser credentials
- Check that admin panel works

### Test Frontend
- Visit: `https://your-app.vercel.app`
- Test user registration
- Test login
- Test provider/employer dashboards
- Visit: `https://your-app.vercel.app/admin/login`
- Login with admin credentials
- Verify admin portal works

## Troubleshooting

### Backend Issues

**Static files not loading:**
- Ensure `build.sh` runs `collectstatic`
- Check that `STATIC_ROOT` is set in settings.py

**Database connection errors:**
- Verify `DATABASE_URL` is correct
- Make sure database and backend are in same region

**CORS errors:**
- Check `CORS_ALLOWED_ORIGINS` includes your Vercel URL
- Ensure URL doesn't have trailing slash

### Frontend Issues

**API connection fails:**
- Verify `VITE_API_URL` is correct
- Check browser console for CORS errors
- Ensure backend URL ends with `/api/`

**Environment variables not working:**
- Redeploy on Vercel after adding variables
- Variables must start with `VITE_`

## Updating Your App

### Update Backend
```bash
git add backend/
git commit -m "Update backend"
git push origin main
```
Render will auto-deploy

### Update Frontend
```bash
git add frontend/
git commit -m "Update frontend"
git push origin main
```
Vercel will auto-deploy

## Custom Domain (Optional)

### For Backend (Render)
1. Go to service Settings → Custom Domain
2. Add your domain
3. Update DNS records as instructed

### For Frontend (Vercel)
1. Go to project Settings → Domains
2. Add your domain
3. Update DNS records as instructed

## Production Checklist

- [ ] SECRET_KEY is randomly generated and secure
- [ ] DEBUG=False in production
- [ ] Database backups configured
- [ ] Email service configured for notifications
- [ ] Admin account created
- [ ] Test all features work
- [ ] Monitor error logs on Render Dashboard

## Support

For issues:
- Check Render logs: Service → Logs
- Check Vercel logs: Deployment → Function Logs
- Check browser console for frontend errors

Your Riderspool app is now live!
- Frontend: https://your-app.vercel.app
- Backend Admin: https://riderspool-backend.onrender.com/admin/
- Admin Portal: https://your-app.vercel.app/admin/login
