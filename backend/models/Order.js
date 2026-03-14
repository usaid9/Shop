const mongoose = require('mongoose')

const orderItemSchema = new mongoose.Schema({
  product:       { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name:          String,
  price:         Number,
  quantity:      Number,
  selectedSize:  String,
  selectedColor: String,
  image:         String,
})

const addressSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone:    { type: String, required: true },
  email:    { type: String },
  city:     { type: String, required: true },
  address:  { type: String, required: true },
  zipCode:  { type: String },
})

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true,
    default: () => `PRE${Date.now().toString().slice(-6)}${Math.random().toString(36).slice(2, 5).toUpperCase()}`,
  },
  items:           [orderItemSchema],
  shippingAddress: { type: addressSchema, required: true },
  paymentMethod:   { type: String, enum: ['jazzcash', 'easypaisa', 'bank', 'cod'], required: true },
  paymentStatus:   { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'out-for-delivery', 'delivered', 'cancelled'],
    default: 'pending',
  },
  subtotal:     { type: Number, required: true },
  shippingCost: { type: Number, default: 500 },
  total:        { type: Number, required: true },

  // JazzCash specific
  jazzCashRef:        { type: String },
  jazzCashTxnRefNo:   { type: String },
  jazzCashResponse:   { type: mongoose.Schema.Types.Mixed },

  statusHistory: [{
    status:    String,
    timestamp: { type: Date, default: Date.now },
    note:      String,
  }],

  notes: String,
}, { timestamps: true })

orderSchema.index({ 'shippingAddress.phone': 1 })
orderSchema.index({ orderId: 1 })
orderSchema.index({ status: 1 })
orderSchema.index({ createdAt: -1 })

module.exports = mongoose.model('Order', orderSchema)
