const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
  name:          { type: String, required: true, trim: true },
  category:      { type: String, required: true, enum: ['shirts','trousers','jackets','shoes','watches','accessories','kurta'] },
  price:         { type: Number, required: true, min: 0 },
  originalPrice: { type: Number },
  image:         { type: String, required: true },
  description:   { type: String, required: true },
  sizes:         [{ type: String }],
  colors:        [{ type: String }],
  inStock:       { type: Boolean, default: true },
  stockQty:      { type: Number, default: 99 },
  rating:        { type: Number, default: 4.5, min: 0, max: 5 },
  reviews:       { type: Number, default: 0 },
  featured:      { type: Boolean, default: false },
  newArrival:    { type: Boolean, default: false },
}, { timestamps: true })

productSchema.index({ category: 1 })
productSchema.index({ featured: 1 })
productSchema.index({ price: 1 })

module.exports = mongoose.model('Product', productSchema)
