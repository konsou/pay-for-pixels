const stripelib = require('stripe')
require('dotenv').config()

const stripe = Stripe(process.env.SECRET_API_KEY)

