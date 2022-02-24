const mongoose = require('mongoose');

const categoryFilterSchema = mongoose.Schema({
	category: {
		type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
		required: true
	},
	filters: {
		type: Array
	}
})


categoryFilterSchema.virtual('id').get(function () {
	return this._id.toHexString();
});

categoryFilterSchema.set('toJSON', {
	virtuals: true,
});

exports.CategoryFilters = mongoose.model('CategoryFilters', categoryFilterSchema);
