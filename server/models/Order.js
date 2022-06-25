const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
	orderItems: [{
		product: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Product',
			required: true
		},
		amount: {
			type: Number,
			required: true
		}
	}],
	shippingAddress1: {
		type: String,
		required: true,
	},
	shippingAddress2: {
		type: String,
		default: ''
	},
	city: {
		type: String,
		required: true,
	},
	zip: {
		type: String,
	},
	phone: {
		type: String,
		required: true,
	},
	status: {
		type: String,
		required: true,
		default: 'pending',
	},
	totalPrice: {
		type: Number,
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
	paid: {
		type: Boolean,
		required: true
	},
	dateOrdered: {
		type: Date,
		default: Date.now,
	},
})

orderSchema.virtual('id').get(function () {
	return this._id.toHexString();
});

orderSchema.set('toJSON', {
	virtuals: true,
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;