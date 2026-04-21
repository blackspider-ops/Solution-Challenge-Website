# Deployment Instructions

## Step 1: Push PDF Service to GitHub

```bash
cd pdf-service
git init
git add .
git commit -m "Initial PDF service"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/gdg-pdf-service.git
git push -u origin main
```

Or add to your existing repo as a subfolder.

## Step 2: Deploy to Render.com

1. Go to https://render.com
2. Sign up with GitHub (free)
3. Click **"New +"** → **"Web Service"**
4. Click **"Connect account"** to link GitHub
5. Select your repository
6. Configure:
   - **Name**: `gdg-pdf-service`
   - **Root Directory**: `pdf-service` (if it's in a subfolder)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Select **"Free"**
7. Click **"Create Web Service"**
8. Wait 5-10 minutes for deployment
9. Once deployed, copy the URL (e.g., `https://gdg-pdf-service.onrender.com`)

## Step 3: Configure Vercel

1. Go to your Vercel project dashboard
2. Go to **Settings** → **Environment Variables**
3. Add new variable:
   - **Name**: `PDF_SERVICE_URL`
   - **Value**: `https://gdg-pdf-service.onrender.com` (your Render URL)
   - **Environment**: Production, Preview, Development
4. Click **Save**
5. Redeploy your Vercel app

## Step 4: Test

Send a test certificate from your admin panel. It should work!

## Troubleshooting

- **Cold starts**: First request takes 30-60 seconds (Render spins down after 15 min idle)
- **Check logs**: Go to Render dashboard → Your service → Logs
- **Test endpoint**: Visit `https://your-service.onrender.com` - should show "PDF Service is running"

## Free Tier Limits

- 750 hours/month (plenty for your use case)
- Spins down after 15 minutes of inactivity
- Spins up automatically on first request
