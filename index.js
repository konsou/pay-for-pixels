const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const { v4: randomUuid } = require('uuid')

const generateColorImage = require('./generate-color-image')

const app = express();

require('dotenv').config();

JSON_PIXELS_FILENAME = 'pixels.json'

// Set your secret key. Remember to switch to your live secret key in production!
// See your keys here: https://dashboard.stripe.com/account/apikeys
const Stripe = require('stripe');
const generateAndSaveColorImage = require('./generate-color-image');
const stripe = Stripe(process.env.SECRET_API_KEY);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Frontend hosting
app.use(express.static('frontend_build'))

console.log('frontend url is', process.env.FRONTEND_URL)
console.log('backend url is ', process.env.BACKEND_URL)

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

const sendEventsToAll = (clients, events) => {
  console.log('send events', events)
  clients.forEach(c => c.res.write(`data: ${JSON.stringify(events)}\n\n`))
}

// addressing: pixels[row][column], or, pixels[y][x]
let pixels = [];
let updatedPixelsEvent = [];
let clients = [];

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

app.get('/events', async (req, res) => {
  console.log('get events')
  res.set({
    'Cache-Control': 'no-cache',
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive'
  });
  res.flushHeaders();
  // Tell the client to retry every 10 seconds if connectivity is lost
  res.write('retry: 10000\n\n');

  const clientId = randomUuid();
  const newClient = {
    id: clientId,
    res
  }
  console.log(`${clientId} connected`)
  clients.push(newClient);

  req.on('close', () => {
    console.log(`${clientId} connection closed`);
    clients = clients.filter(client => client.id !== clientId);
  })
})

app.get('/color-images/:color/:size', async (req, res) => {
  ///:color/:size'
  const color = req.params.color
  const size = req.params.size
  let filename
  if (size <= 500) {
    filename = `/color-images/${color}-${size}.png`
    console.log(`request for color image - color ${color} size ${size}`)

    if (!fs.existsSync(`.${filename}`)) {
      await generateAndSaveColorImage(size, `#${color}`, `.${filename}`)
    }
  } else {
    filename = '/images/trollface.png'
  }
  res.sendFile(__dirname + filename)
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
      console.log('image url:', `${process.env.FRONTEND_URL}/color-images/${pixel.color}/20`)
      return (
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Pixel at ${pixel.x},${pixel.y}`,
              images: [ `${process.env.FRONTEND_URL}/color-images/${pixel.color.substring(1)}/20` ]
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
    success_url: process.env.BACKEND_URL + '/success?session_id={CHECKOUT_SESSION_ID}',
    cancel_url: process.env.BACKEND_URL + '/cancel',
  });

  res.json({ id: session.id });
});

app.get('/success', async (req, res) => {
    console.log('transaction successful')
    const session = await stripe.checkout.sessions.retrieve(req.query.session_id);

    // TODO: FIX THIS. METADATA CAN ONLY BE 500 CHARACTERS LONG.
    // NEED TO USE WEBHOOKS?
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
    sendEventsToAll(clients, changedPixels)

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