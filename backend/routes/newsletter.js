const express    = require('express')
const router     = express.Router()
const Subscriber = require('../models/Subscriber')

// POST /api/newsletter
router.post('/', async (req, res) => {
  try {
    const { email } = req.body
    if (!email) return res.status(400).json({ message: 'Email required' })

    const existing = await Subscriber.findOne({ email: email.toLowerCase() })
    if (existing) {
      existing.active = true
      await existing.save()
      return res.json({ message: 'Already subscribed — welcome back!' })
    }

    await Subscriber.create({ email: email.toLowerCase() })
    res.status(201).json({ message: 'Subscribed successfully!' })
  } catch (err) {
    res.status(500).json({ message: 'Subscription failed' })
  }
})

// DELETE /api/newsletter/:email  — Unsubscribe
router.delete('/:email', async (req, res) => {
  try {
    await Subscriber.findOneAndUpdate({ email: req.params.email }, { active: false })
    res.json({ message: 'Unsubscribed successfully' })
  } catch (err) {
    res.status(500).json({ message: 'Failed to unsubscribe' })
  }
})

module.exports = router
