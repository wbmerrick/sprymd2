# Railway Deployment Checklist

## Step 1: Create GitHub Repository
1. Go to [github.com/new](https://github.com/new)
2. Name it `sprymd`
3. Choose "Public" or "Private" (doesn't matter for Railway)
4. **Do NOT initialize with README** (you already have one)
5. Click "Create repository"

## Step 2: Push Code to GitHub
Copy and run these commands in your local project folder:

```bash
cd ~/Projects/sprymd

git remote add origin https://github.com/YOUR_USERNAME/sprymd.git
git branch -M main
git push -u origin main
```

(Replace `YOUR_USERNAME` with your actual GitHub username)

## Step 3: Deploy to Railway
1. Go to [railway.app](https://railway.app)
2. Sign up or log in with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Authorize railway.app to access your GitHub
6. Select the `sprymd` repository
7. Railway auto-detects Node.js and creates deployment
8. Wait 2-3 minutes for the build to complete

## Step 4: Set Environment Variables
In your Railway project dashboard:

1. Go to the project settings
2. Click "Variables" (or "Environment")
3. Add these variables (values from `.env.example`):

| Variable | Value | Notes |
|----------|-------|-------|
| `STRIPE_SECRET_KEY` | `sk_test_...` | From Stripe dashboard |
| `STRIPE_PUBLISHABLE_KEY` | `pk_test_...` | From Stripe dashboard |
| `SENDGRID_API_KEY` | `SG....` | From SendGrid (optional if not using email) |
| `SENDGRID_FROM_EMAIL` | `noreply@yourdomain.com` | Your email domain |
| `SENDGRID_TO_EMAIL` | `leads@yourdomain.com` | Where leads go |
| `SESSION_SECRET` | (random 32+ char string) | For session security |

Railway auto-sets `PORT` — don't add it.

## Step 5: Verify Deployment
1. Railway gives you a live URL (something like `https://sprymd-production.up.railway.app`)
2. Visit that URL in your browser
3. You should see the SpryMD homepage
4. Test the FAQ accordion — click a question
5. Check browser console (F12) for any errors

## Step 6: Get Real API Keys

### Stripe
1. Sign up at [stripe.com](https://stripe.com)
2. Go to Dashboard → API Keys
3. Copy your **Secret Key** (starts with `sk_test_`) → add to Railway Variables
4. Copy your **Publishable Key** (starts with `pk_test_`) → add to Railway Variables

### SendGrid (optional, only if you want lead emails)
1. Sign up at [sendgrid.com](https://sendgrid.com)
2. Go to Settings → API Keys
3. Create a new key with "Mail Send" permissions
4. Copy it → add `SENDGRID_API_KEY` to Railway Variables
5. Set `SENDGRID_FROM_EMAIL` and `SENDGRID_TO_EMAIL`

## Step 7: Test API Endpoints
Once deployed, test these from your browser or Postman:

```
GET https://your-railway-url/health
→ Should return {"status":"ok"}

GET https://your-railway-url/api/config
→ Should return {"stripePublishableKey":"pk_test_..."}
```

## Troubleshooting

### Build fails
- Check Railway build logs (click project → "Logs" tab)
- Make sure `package.json` exists at repo root
- Verify `server.js` is in repo root

### App crashes after deploy
- Check Runtime logs in Railway dashboard
- Look for missing environment variable errors
- Ensure all required `.env` variables are set

### Stripe checkout not working
- Verify `STRIPE_PUBLISHABLE_KEY` is set correctly
- Check browser console for errors (F12)
- Create a test Product + Price in Stripe dashboard first

## Auto-Redeploy
Railway auto-redeploys when you push to GitHub. To update production:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

Railway picks it up automatically — watch the "Deployments" tab in Railway dashboard.

## Database (Future)
When you add a database later (Postgres, MongoDB, etc.):
1. Add database service to Railway project
2. Railway provides connection string as env var
3. Add that to `DATABASE_URL` in Railway Variables
4. Update `server.js` to connect and persist leads
