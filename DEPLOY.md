# NEXIVORA Deployment Guide

## Easiest Option: Railway (Free Tier)

### Step 1: Push Code to GitHub

1. Go to https://github.com/new
2. Create a new repository (name it `nexivora`)
3. Run these commands in your terminal:

```bash
cd /path/to/your/nexivora-project
git init
git add .
git commit -m "Initial commit - NEXIVORA ready for deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/nexivora.git
git push -u origin main
```

### Step 2: Deploy on Railway

1. Go to https://railway.app and sign up (free with GitHub)
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your `nexivora` repository
4. Railway will auto-detect the `railway.toml` and `Dockerfile`
5. Add your environment variables (see below)
6. Click **"Deploy"**

### Step 3: Add Environment Variables

In Railway dashboard, go to your project → **Variables**, add these:

```
DATABASE_URL=mysql://2UPAMesnXhF1Awe.root:f1l4dAphbFeetw9hn5ya61OloLOdYKTW@ep-t4ni387b5e83b7519dc8.epsrv-t4n281l4mrmemi4zls9a.ap-southeast-1.privatelink.aliyuncs.com:4000/19e96a67-5202-8095-8000-090d6bd172bb
APP_ID=19e96afd-67e2-812c-8000-0000e8a6527a
APP_SECRET=oG9EbEWsej0VmCiWQgwltDLVpACjUipN
VITE_APP_ID=19e96afd-67e2-812c-8000-0000e8a6527a
VITE_KIMI_AUTH_URL=https://auth.kimi.com
KIMI_AUTH_URL=https://auth.kimi.com
KIMI_OPEN_URL=https://open.kimi.com
OWNER_UNION_ID=d6dbcevftae684l66t40
```

### Step 4: Update Frontend API URL

After deployment, Railway gives you a URL like `https://nexivora.up.railway.app`.

Update `src/providers/trpc.tsx` to point to your live URL:
```typescript
// Change from localhost to your Railway URL
const apiUrl = "https://YOUR_RAILWAY_URL/api/trpc";
```

### Step 5: Your App is Live!

- **Frontend**: `https://YOUR_RAILWAY_URL` (the full NEXIVORA website)
- **API**: `https://YOUR_RAILWAY_URL/api/trpc/...`

---

## Alternative: Render (Free Tier)

1. Go to https://render.com and sign up (free with GitHub)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repo
4. Render will read `render.yaml` auto-config
5. Add environment variables in the dashboard
6. Click **"Create Web Service"**

---

## Alternative: VPS ($5/month - Best Performance)

Get a VPS from DigitalOcean, Vultr, or Hetzner, then SSH and run:

```bash
# 1. Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. Clone your repo
git clone https://github.com/YOUR_USERNAME/nexivora.git
cd nexivora

# 3. Install dependencies
npm install

# 4. Build
npm run build

# 5. Start with PM2 (keeps running forever)
sudo npm install -g pm2
pm2 start dist/boot.js --name nexivora
pm2 startup
pm2 save

# 6. Your app is running on port 3000
# Set up Nginx or use the VPS IP directly
```

---

## What Changes After Deployment?

| Feature | Static (Before) | With Backend (After) |
|---------|----------------|---------------------|
| Products | Fallback data | Live from database |
| Blog | Fallback articles | Live from database |
| Orders | localStorage only | Saved to database |
| Commissions | Local calculation | Real DB tracking |
| Admin panel | localStorage data | Real data for all users |
| Referral links | Work with "Nexivora Marketer" | Show actual referrer name |
| Cross-device | ❌ No | ✅ Yes, data syncs |
| Multiple users | ❌ Per-browser only | ✅ Everyone sees same data |

---

## Troubleshooting

**"Server Error" after deploy?**
- Check Railway/Render logs
- Verify `DATABASE_URL` is correct
- Make sure `npm run build` succeeded

**API not responding?**
- Test: `curl https://YOUR_URL/api/trpc/ping`
- Should return: `{"ok": true}`

**Blank page?**
- Check browser console for CORS errors
- Ensure API URL in `trpc.tsx` matches your deployed URL

---

## Need Help?

If you get stuck on any step, send me:
1. The error message (screenshot or text)
2. Which step you're on
3. Your hosting platform (Railway/Render/VPS)
