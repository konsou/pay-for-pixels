// This example sets up an endpoint using the Express framework.
// Watch this video to get started: https://youtu.be/rPR2aJ6XnAc.

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

require('dotenv').config();

// Set your secret key. Remember to switch to your live secret key in production!
// See your keys here: https://dashboard.stripe.com/account/apikeys
const Stripe = require('stripe');
const stripe = Stripe(process.env.SECRET_API_KEY);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());


app.post('/claim-pixel', async (req, res) => {
    console.log('req.body:');
    console.log(req.body);

    // TODO: HANDLE SEVERAL PIXELS

    const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    metadata: {
        x: req.body[0].column,
        y: req.body[0].row,
        color: req.body[0].color,
        owner: req.body[0].owner,
        note: req.body[0].note,
        amount: req.body[0].amount,
    },

    line_items: [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: `Cell ${req.body[0].x},${req.body[0].y}`,
            metadata: {
              x: req.body[0].column,
              y: req.body[0].row,
              color: req.body[0].color,
              owner: req.body[0].owner,
              note: req.body[0].note,
              amount: req.body[0].amount,
                  },
            },
          unit_amount: req.body[0].amount * 100,
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