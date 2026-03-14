const express = require('express')
const router  = express.Router()
const Product = require('../models/Product')

// GET /api/products
// Query params: category, sort, featured, newArrival, minPrice, maxPrice, page, limit
router.get('/', async (req, res) => {
  try {
    const {
      category, sort = 'popular', featured, newArrival,
      minPrice, maxPrice, page = 1, limit = 20,
    } = req.query

    const filter = {}
    if (category && category !== 'all') filter.category = category
    if (featured === 'true')           filter.featured  = true
    if (newArrival === 'true')         filter.newArrival = true
    if (minPrice || maxPrice) {
      filter.price = {}
      if (minPrice) filter.price.$gte = Number(minPrice)
      if (maxPrice) filter.price.$lte = Number(maxPrice)
    }

    const sortMap = {
      popular:    { reviews: -1 },
      'price-low':  { price:   1 },
      'price-high': { price:  -1 },
      rating:     { rating: -1 },
      new:        { createdAt: -1 },
    }
    const sortObj = sortMap[sort] || { reviews: -1 }

    const skip  = (Number(page) - 1) * Number(limit)
    const total = await Product.countDocuments(filter)
    const products = await Product.find(filter).sort(sortObj).skip(skip).limit(Number(limit))

    res.json({ products, total, page: Number(page), pages: Math.ceil(total / Number(limit)) })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to fetch products' })
  }
})

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ message: 'Product not found' })
    res.json(product)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch product' })
  }
})

// POST /api/products  (Admin — protect with auth middleware in production)
router.post('/', async (req, res) => {
  try {
    const product = new Product(req.body)
    await product.save()
    res.status(201).json(product)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// PUT /api/products/:id
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!product) return res.status(404).json({ message: 'Product not found' })
    res.json(product)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// DELETE /api/products/:id
router.delete('/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id)
    res.json({ message: 'Product deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
