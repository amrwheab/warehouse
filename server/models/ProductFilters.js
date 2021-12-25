const mongoose = require('mongoose');

const productFilterSchema = mongoose.Schema({
    product: {
        type: String,
        required: true,
    },
    filters: {
      type: Array
    }
})


productFilterSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

productFilterSchema.set('toJSON', {
    virtuals: true,
});

exports.Category = mongoose.model('ProductFilter', productFilterSchema);
