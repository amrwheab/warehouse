const mongoose = require('mongoose');

const subscriperSchema = mongoose.Schema({
  email: {
    type: String,
    required: true
  }
})


subscriperSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

subscriperSchema.set('toJSON', {
  virtuals: true,
});

const Subscriber = mongoose.model('Subscriber', subscriperSchema);

module.exports = Subscriber