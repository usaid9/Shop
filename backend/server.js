require('dotenv').config()
const express     = require('express')
const mongoose    = require('mongoose')
const cors        = require('cors')
const helmet      = require('helmet')
const rateLimit   = require('express-rate-limit')

// ── Route imports ─────────────────────────────────────────────
const productsRouter   = require('./routes/products')
const ordersRouter     = require('./routes/orders')
const paymentRouter    = require('./routes/payment')
const newsletterRouter = require('./routes/newsletter')

const app  = express()
const PORT = process.env.PORT || 5000

// ── Security middleware ───────────────────────────────────────
app.use(helmet())
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}))

// Rate limiting — 100 requests per 15 minutes per IP
app.use('/api/', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: 'Too many requests, please try again later.' },
}))

// ── Body parsers ──────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true }))

// ── MongoDB connection ────────────────────────────────────────
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser:    true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅  MongoDB connected'))
  .catch(err => {
    console.error('❌  MongoDB connection error:', err.message)
    process.exit(1)
  })

// ── Routes ────────────────────────────────────────────────────
app.use('/api/products',   productsRouter)
app.use('/api/orders',     ordersRouter)
app.use('/api/payment',    paymentRouter)
app.use('/api/newsletter', newsletterRouter)

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'PREMIUM Fashion Store API',
    env: process.env.NODE_ENV || 'development',
    mongo: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.path} not found` })
})

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err)
  res.status(err.status || 500).json({
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  })
})

// ── Start ─────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀  Backend running on http://localhost:${PORT}`)
  console.log(`📦  JazzCash mode: ${process.env.JAZZCASH_ENV || 'sandbox'}`)
})
