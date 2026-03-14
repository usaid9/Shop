const express = require('express')
const router  = express.Router()
const Order   = require('../models/Order')

// POST /api/orders  — Place new order
router.post('/', async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, subtotal, shippingCost, total } = req.body

    if (!items?.length)        return res.status(400).json({ message: 'No items in order' })
    if (!shippingAddress)      return res.status(400).json({ message: 'Shipping address required' })
    if (!paymentMethod)        return res.status(400).json({ message: 'Payment method required' })

    const order = new Order({
      items,
      shippingAddress,
      paymentMethod,
      subtotal,
      shippingCost: shippingCost || 500,
      total,
      statusHistory: [{ status: 'pending', note: 'Order placed' }],
    })

    await order.save()
    res.status(201).json(order)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to create order' })
  }
})

// GET /api/orders/:id  — Get order by MongoDB _id or orderId
router.get('/:id', async (req, res) => {
  try {
    let order = await Order.findById(req.params.id).catch(() => null)
    if (!order) order = await Order.findOne({ orderId: req.params.id })
    if (!order) return res.status(404).json({ message: 'Order not found' })
    res.json(order)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch order' })
  }
})

// GET /api/orders/by-phone/:phone  — Track by phone number
router.get('/by-phone/:phone', async (req, res) => {
  try {
    const orders = await Order.find({ 'shippingAddress.phone': req.params.phone })
      .sort({ createdAt: -1 })
      .limit(10)
    res.json(orders)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders' })
  }
})

// PATCH /api/orders/:id/status  — Update order status (Admin)
router.patch('/:id/status', async (req, res) => {
  try {
    const { status, note } = req.body
    const order = await Order.findById(req.params.id)
    if (!order) return res.status(404).json({ message: 'Order not found' })

    order.status = status
    order.statusHistory.push({ status, note: note || '' })
    await order.save()

    res.json(order)
  } catch (err) {
    res.status(500).json({ message: 'Failed to update order status' })
  }
})

// GET /api/orders  — All orders (Admin)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query
    const filter = status ? { status } : {}
    const skip = (Number(page) - 1) * Number(limit)
    const total = await Order.countDocuments(filter)
    const orders = await Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit))
    res.json({ orders, total, page: Number(page) })
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders' })
  }
})

module.exports = router
