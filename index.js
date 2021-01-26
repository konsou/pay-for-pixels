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

    const pixels = req.body.map(pixel => {
      return (
        {
          x: pixel.x,
          y: pixel.y,
          color: pixel.color,
          owner: pixel.owner || 'Anonymous',
          note: pixel.note,
          amount: pixel.amount,
        }
      )
    });

    console.log('pixels:');
    console.log(pixels);

    const line_items = pixels.map(pixel => {
      return (
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Cell ${pixel.x},${pixel.y}`,
              // metadata: { pixel: pixel },
              },
            unit_amount: pixel.amount * 100,
          },
          quantity: 1,
        }
      )
    });

    console.log('line_items:');
    console.log(line_items);

    const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    metadata: {
        test: "yes",
        // pixels: pixels
    },

    line_items: line_items,

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