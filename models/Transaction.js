const mongoose = require('mongoose');

const { Schema } = mongoose;

const Transaction = new Schema({
	date: { type: Date, default: Date.now },
	user: { type: Schema.Types.ObjectId, required: true },
	type: { type: String, required: true },
	cancelled: { type: Boolean, default: false },
	data: { type: Object },
});

module.exports = mongoose.model('Transaction', Transaction);
