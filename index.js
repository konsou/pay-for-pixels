const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();

require('dotenv').config();

JSON_PIXELS_FILENAME = 'pixels.json'

// Set your secret key. Remember to switch to your live secret key in production!
// See your keys here: https://dashboard.stripe.com/account/apikeys
const Stripe = require('stripe');
const stripe = Stripe(process.env.SECRET_API_KEY);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Frontend hosting
app.use(express.static('frontend_build'))

console.log('frontend url is', process.env.FRONTEND_URL)

const savePixels = (pixels) => {
  const pixelsJson = JSON.stringify(pixels, null, 4);
  fs.writeFile(JSON_PIXELS_FILENAME, pixelsJson, (err) => {
    if (err) { console.error(err) }
    else { console.log('pixels saved') }
  })
}

const loadPixels = () => {
  const data = fs.readFileSync(JSON_PIXELS_FILENAME)
  console.log('pixels loaded')
  return JSON.parse(data)
}

// addressing: pixels[row][column], or, pixels[y][x]
let pixels = [];

try {
  pixels = loadPixels()
} catch (err) {
  console.log('generate empty pixels')

  const emptyPixel = {
    color: '#FFFFFF',
    owner: 'not claimed',
    note: '',
    amount: 0.45,
  }
  
  // TODO: load pixels from DB
  for (let row = 0; row < 100; row++) {
    pixels.push([]);
  
    for (let column = 0; column < 100; column++) {
      pixels[row].push({
        ...emptyPixel,
        x: column,
        y: row,
        // color: `#${ (row * column).toString(16)}`,
      })
    }
  }
  
}





app.get('/pixels', async (req, res) => {
  res.json(pixels)
})


app.post('/claim-pixels', async (req, res) => {
    // console.log('req.body:');
    // console.log(req.body);

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
              name: `Pixel at ${pixel.x},${pixel.y}`,
              // metadata: { pixel: pixel },
              },
            unit_amount: pixel.amount * 100,
          },
          quantity: 1,
        }
      )
    });

    // console.log('line_items:');
    // console.log(line_items);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      metadata: {
          pixels: JSON.stringify(pixels),
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

    const affectedPixels = JSON.parse(session.metadata.pixels)
    const changedPixels = []

    // TODO: Check if amount is large enough to change pixels
    // commit changes to db
    affectedPixels.forEach( pixel => {
      const oldPixel = pixels[pixel.y][pixel.x]
      // console.log('old pixel: ', oldPixel)
      // console.log('new pixel: ', pixel)
      if (pixel.amount > oldPixel.amount) {
        console.log(`amount for pixel ${pixel.x}, ${pixel.y} (${pixel.amount}) is greater than old (${oldPixel.amount}), replacing`)
        pixels[pixel.y][pixel.x] = pixel
        changedPixels.push(pixel)
      } else {
        console.log(`amount for pixel ${pixel.x}, ${pixel.y} (${pixel.amount}) is not greater than old (${oldPixel.amount}), not replacing`)
      }
    })

    savePixels(pixels)

    //console.log(affectedPixels);
    //res.json(changedPixels);
    res.redirect(process.env.FRONTEND_URL)
});

app.get('/cancel', async (req, res) => {
    res.json({ result: "cancel" });
})

app.post('/webhook', bodyParser.raw({type: 'application/json'}), (request, response) => {
  const payload = request.body;

  console.log("Got payload: ", payload);

  response.status(200);
});



app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}!`));