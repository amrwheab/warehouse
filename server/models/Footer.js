const mongoose = require('mongoose')

const footerSchema = mongoose.Schema({
  field: {
    type: {
      title: String,
      rows: [{
        title: String,
        path: String
      }]
    }
  },
})

footerSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

footerSchema.set('toJSON', {
  virtuals: true,
});

const Footer = mongoose.model('Footer', footerSchema)

module.exports = Footer