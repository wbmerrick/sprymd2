# SpryMD Website

Modern men's health telehealth platform with Node.js backend and static frontend.

## Quick Start

### Local Development
```bash
npm install
cp .env.example .env
# Fill in your API keys in .env
npm run dev
```

Visit `http://localhost:3000`

### Production Deployment (Railway)

1. **Push to GitHub**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/sprymd.git
   git branch -M main
   git push -u origin main
   ```

2. **Connect to Railway**
   - Go to [railway.app](https://railway.app)
   - Click "New Project"
   - Select "Deploy from GitHub"
   - Choose this repository
   - Railway will auto-detect Node.js and create a deployment

3. **Set Environment Variables in Railway**
   - In your Railway project dashboard, go to "Variables"
   - Add each variable from `.env.example`:
     - `STRIPE_SECRET_KEY`
     - `STRIPE_PUBLISHABLE_KEY`
     - `SENDGRID_API_KEY`
     - `SENDGRID_FROM_EMAIL`
     - `SENDGRID_TO_EMAIL`
     - `SESSION_SECRET` (generate a long random string)
   - Railway will auto-set `PORT`

4. **Deploy**
   - Click "Deploy" — Railway builds and serves automatically
   - Your site will be live at the provided Railway URL

## API Endpoints

### `GET /health`
Health check for Railway deployments.

### `GET /api/config`
Returns Stripe publishable key (safe to expose).

### `POST /api/questionnaire`
Lead capture endpoint. Sends intake form to email.
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "category": "Endurance Rx",
  "answers": { "duration": "6 months", "severity": "moderate" }
}
```

### `POST /api/create-checkout-session`
Creates a Stripe checkout session for a treatment plan.
```json
{
  "priceId": "price_1234567890",
  "quantity": 1
}
```

## File Structure
```
sprymd/
├── server.js           # Express backend
├── package.json        # Dependencies
├── .env.example        # Environment template
├── public/
│   ├── index.html      # Homepage
│   ├── styles.css      # Styles
│   └── script.js       # Frontend JS
└── README.md
```

## Next Steps
- [ ] Wire up Stripe Products/Prices in dashboard
- [ ] Create SendGrid account and API key
- [ ] Connect a database for lead persistence
- [ ] Add user authentication
- [ ] Build treatment intake flow
- [ ] Launch with real content & branding

## Notes
- Stripe keys in `.env` are placeholders — replace with real keys before launching
- SendGrid emails are optional; remove that check if not using email
- Database persistence is stubbed in `/api/questionnaire` — add your DB connection
