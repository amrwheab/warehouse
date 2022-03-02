const mongoose = require('mongoose');

const carouselSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  action: {
    type: String,
    required: true
  }
})


carouselSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

carouselSchema.set('toJSON', {
  virtuals: true,
});

const Carousel = mongoose.model('Carousel', carouselSchema);

module.exports = Carousel