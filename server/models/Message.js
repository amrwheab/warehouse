const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  }
})


messageSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

messageSchema.set('toJSON', {
  virtuals: true,
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message