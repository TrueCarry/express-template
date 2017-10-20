import express from 'express'
import { Nuxt, Builder } from 'nuxt'
import session from 'express-session'
import dotenv from 'dotenv'
import connectMongo from 'connect-mongo'
import mongoose from 'mongoose'
import passport from 'passport'
import compression from 'compression'

import api from './api'

const passportConfig = require('./passport')

dotenv.load({ path: '.env' })
const MongoStore = connectMongo(session)

const app = express()
const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000

app.set('port', port)

/**
 * Connect to MongoDB.
 */
mongoose.Promise = global.Promise
mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on('error', (err) => {
  console.error(err)
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.' )
  process.exit()
})

app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  store: new MongoStore({
    url: process.env.MONGODB_URI,
    autoReconnect: true,
    clear_interval: 3600
  })
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(compression())

// Import API Routes
app.use('/api', api)

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

// Init Nuxt.js
const nuxt = new Nuxt(config)

// Build only in dev mode
if (config.dev) {
  const builder = new Builder(nuxt)
  builder.build()
}

// Give nuxt middleware to express
app.use(nuxt.render)

// Listen the server
app.listen(port, host)
console.log('Server listening on ' + host + ':' + port) // eslint-disable-line no-console
