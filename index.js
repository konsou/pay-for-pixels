// This example sets up an endpoint using the Express framework.
// Watch this video to get started: https://youtu.be/rPR2aJ6XnAc.

const express = require('express');
const cors = require('cors');
const app = express();

require('dotenv').config();

// Set your secret key. Remember to switch to your live secret key in production!
// See your keys here: https://dashboard.stripe.com/account/apikeys
const Stripe = require('stripe');
const stripe = Stripe(process.env.SECRET_API_KEY);

app.use(cors());

app.post('/purchase-cell/:column/:row/:color/:note', async (req, res) => {
    console.log('req.params:');
    console.log(req.params);

    const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    metadata: {
        column: req.params.column,
        row: req.params.row,
        color: req.params.color,
        note: req.params.note
    },

    line_items: [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: `Cell ${req.params.column},${req.params.row}`,
            metadata: {
                column: req.params.column,
                row: req.params.row,
                color: req.params.color,
                note: req.params.note
            },
            },
          unit_amount: 2000,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: process.env.SITE_URL + '/success?session_id={CHECKOUT_SESSION_ID}',
    cancel_url: process.env.SITE_URL + '/cancel',
  });

  res.json({ id: session.id });
});

app.get('/success', async (req, res) => {
    const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
    res.json(session);
});

app.get('/cancel', async (req, res) => {
    res.json({ result: "cancel" });
})


app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}!`));