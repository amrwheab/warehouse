const mongoose = require('mongoose')

const rateSchema = mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rate: {
    type: Number,
    required: true
  }
})

const Rate = mongoose.model('Rate', rateSchema)
module.exports = Rate