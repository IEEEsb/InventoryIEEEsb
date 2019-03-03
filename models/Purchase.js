const mongoose = require('mongoose');
const Float = require('mongoose-float').loadType(mongoose);

const { Schema } = mongoose;

const Purchase = new Schema({
	date: { type: Date, default: Date.now },
	user: { type: Schema.Types.ObjectId, required: true },
	totalPrice: { type: Float, required: true },
	moneyLeft: { type: Float, required: true },
	finished: { type: Boolean, default: false },
	items: [{
		item: { type: Schema.Types.ObjectId, ref: 'Item', required: true },
		quantityLeft: {
			real: { type: Float, required: true },
			inventory: { type: Float, required: true },
		},
		quantity: { type: Float, required: true },
		price: { type: Float, required: true },
	}],
});

module.exports = mongoose.model('Purchase', Purchase);
