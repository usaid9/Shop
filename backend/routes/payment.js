const express  = require('express')
const router   = express.Router()
const Order    = require('../models/Order')
const jazzcash = require('../config/jazzcash')

// POST /api/payment/jazzcash
// Initiate a JazzCash Mobile Wallet payment
router.post('/jazzcash', async (req, res) => {
  try {
    const { orderId, amount, phone, description } = req.body

    if (!orderId || !amount || !phone) {
      return res.status(400).json({ message: 'orderId, amount, and phone are required' })
    }

    const result = await jazzcash.initiatePayment({ orderId, amount, phone, description })

    // Update order with JazzCash txnRefNo
    await Order.findByIdAndUpdate(orderId, {
      jazzCashTxnRefNo: result.txnRefNo,
      jazzCashResponse: result.jazzCashResponse,
    }).catch(() => {}) // non-fatal

    res.json({
      success: result.success,
      txnRefNo: result.txnRefNo,
      message: result.message,
      // In sandbox you'll get a redirect URL or the transaction status directly
      redirectUrl: result.jazzCashResponse?.pp_PaymentURL || null,
    })
  } catch (err) {
    console.error('JazzCash initiate error:', err.message)
    res.status(500).json({ message: err.message || 'JazzCash payment initiation failed' })
  }
})

// POST /api/payment/jazzcash/verify
// Verify callback from JazzCash (JazzCash posts to your return URL)
router.post('/jazzcash/verify', async (req, res) => {
  try {
    const callbackParams = req.body
    const result = jazzcash.verifyCallback(callbackParams)

    if (!result.valid) {
      console.warn('JazzCash callback hash mismatch:', callbackParams)
      return res.status(400).json({ message: 'Invalid secure hash — possible tampering' })
    }

    // Find and update the order
    if (result.orderId) {
      const paymentStatus = result.success ? 'completed' : 'failed'
      const orderStatus   = result.success ? 'processing' : 'pending'

      await Order.findByIdAndUpdate(result.orderId, {
        paymentStatus,
        status: orderStatus,
        jazzCashRef: result.txnRefNo,
        $push: { statusHistory: { status: orderStatus, note: `JazzCash ${paymentStatus}` } },
      })
    }

    // JazzCash expects a 200 response
    res.json({
      success: result.success,
      message: result.message,
      orderId: result.orderId,
    })
  } catch (err) {
    console.error('JazzCash verify error:', err.message)
    res.status(500).json({ message: 'Verification failed' })
  }
})

// GET /api/payment/jazzcash/callback  (JazzCash may also GET the return URL — redirect user)
router.get('/jazzcash/callback', (req, res) => {
  const { pp_ResponseCode, ppmpf_1: orderId } = req.query
  const success = pp_ResponseCode === '000'

  // Redirect user to frontend with result
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000'
  res.redirect(`${clientUrl}/orders?orderId=${orderId}&status=${success ? 'success' : 'failed'}`)
})

module.exports = router
