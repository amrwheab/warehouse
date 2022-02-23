const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true
  },
  cardImage: {
    type: String,
    default: ''
  },
  images: [{
    url: {
      type: String
    },
    color: {
      type: String
    }
  }],
  brand: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    default: 0
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  countInStock: {
    type: Number,
    required: true,
    min: 0,
    max: 255
  },
  rating: {
    type: Number,
    default: 0,
  },
  numReviews: {
    type: Number,
    default: 0,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  dateCreated: {
    type: Date,
    default: Date.now(),
  },
  slug: {
    type: String,
    unique: true,
    slug: 'name'
  }
})

productSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

productSchema.set('toJSON', {
  virtuals: true,
});

const Product = mongoose.model('Product', productSchema);


module.exports = Product