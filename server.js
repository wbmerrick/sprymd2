require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const sgMail = require('@sendgrid/mail');

if (process.env.SENDGRID_API_KEY && !process.env.SENDGRID_API_KEY.includes('REPLACE_ME')) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Expose the publishable key to the frontend safely
app.get('/api/config', (req, res) => {
  res.json({ stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY });
});

// Health check for Railway
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Health questionnaire / lead capture
app.post('/api/questionnaire', async (req, res) => {
  const { name, email, category, answers } = req.body;
  if (!name || !email || !category) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  try {
    // TODO: persist to your database using DATABASE_URL
    console.log('New questionnaire submission:', { name, email, category, answers });

    if (process.env.SENDGRID_API_KEY && !process.env.SENDGRID_API_KEY.includes('REPLACE_ME')) {
      await sgMail.send({
        to: process.env.SENDGRID_TO_EMAIL,
        from: process.env.SENDGRID_FROM_EMAIL,
        subject: `New SpryMD intake: ${category}`,
        text: `Name: ${name}\nEmail: ${email}\nCategory: ${category}\nAnswers: ${JSON.stringify(answers)}`
      });
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

// Stripe checkout session for a treatment plan
app.post('/api/create-checkout-session', async (req, res) => {
  const { priceId, quantity = 1 } = req.body;
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity }],
      success_url: `${req.headers.origin}/success.html`,
      cancel_url: `${req.headers.origin}/cancel.html`,
    });
    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`SpryMD server running on port ${PORT}`));
