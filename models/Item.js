const mongoose = require('mongoose');
const Float = require('mongoose-float').loadType(mongoose);

const { Schema } = mongoose;

const Item = new Schema({
	code: { type: Number, default: 0, index: { unique: true, dropDups: true } },
	name: { type: String, default: '', index: { unique: true, dropDups: true } },
	type: { type: String, required: true, default: 'consumable' },
	tags: [{ type: String, default: '' }],
	step: { type: Float, required: true, default: 1.0 },
	quantity: { type: Float, required: true, min: 0, default: 0 },
	price: { type: Float, default: 0.0 },
	sellPercent: { type: Float, default: 0.0 },
	icon: { type: String, default: '' },
	files: [{ type: String, default: '' }],
});

module.exports = mongoose.model('Item', Item);
